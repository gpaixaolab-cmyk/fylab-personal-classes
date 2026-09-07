-- Aplicar APÓS o schema.sql original. Não recria nem apaga Alice.
begin;

-- A conta principal já existe. Nenhum novo cadastro público ganha privilégios.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,role,display_name)
  values(new.id,'student',nullif(new.raw_user_meta_data->>'display_name',''))
  on conflict(id) do nothing;
  return new;
end; $$;

create table if not exists public.personal_spaces (
 student_id uuid primary key references public.students(id) on delete cascade,
 username text not null unique check(username ~ '^[a-z0-9][a-z0-9._-]{2,29}$'),
 kind text not null default 'felipe' check(kind = 'felipe'),
 welcome text not null default 'Vamos descobrir seu perfil de inglês e planejar as próximas aulas.',
 created_at timestamptz not null default now()
);
create table if not exists public.felipe_sessions (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.personal_spaces(student_id) on delete cascade,
 version text not null default 'felipe-diagnostic-v1' check(version='felipe-diagnostic-v1'),
 stage integer not null default 0 check(stage between 0 and 5),
 revision integer not null default 0,
 evidence jsonb not null default '{}'::jsonb check(jsonb_typeof(evidence)='object' and octet_length(evidence::text)<200000),
 status text not null default 'draft' check(status in ('draft','submitted')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 submitted_at timestamptz,
 unique(student_id,version)
);
create table if not exists public.felipe_reviews (
 session_id uuid primary key references public.felipe_sessions(id) on delete cascade,
 review jsonb not null default '{}'::jsonb check(jsonb_typeof(review)='object' and octet_length(review::text)<200000),
 published boolean not null default false,
 updated_at timestamptz not null default now()
);
create table if not exists public.personal_materials (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.personal_spaces(student_id) on delete cascade,
 title text not null check(char_length(title) between 1 and 160),
 body text not null check(char_length(body) between 1 and 20000),
 published boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.personal_completions (
 material_id uuid primary key references public.personal_materials(id) on delete cascade,
 completed_at timestamptz not null default now()
);

-- Helpers SECURITY DEFINER evitam políticas recursivas; identidade vem do JWT.
create or replace function public.owns_personal_student(sid uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.students where id=sid and active and auth_user_id=auth.uid());
$$;
create or replace function public.teaches_personal_student(sid uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.students s join public.profiles p on p.id=s.teacher_id
 where s.id=sid and p.id=auth.uid() and p.role='teacher');
$$;
revoke all on function public.owns_personal_student(uuid) from public;
revoke all on function public.teaches_personal_student(uuid) from public;
grant execute on function public.owns_personal_student(uuid),public.teaches_personal_student(uuid) to authenticated;

alter table public.personal_spaces enable row level security;
alter table public.felipe_sessions enable row level security;
alter table public.felipe_reviews enable row level security;
alter table public.personal_materials enable row level security;
alter table public.personal_completions enable row level security;

drop policy if exists spaces_read on public.personal_spaces;
create policy spaces_read on public.personal_spaces for select to authenticated
 using(public.owns_personal_student(student_id) or public.teaches_personal_student(student_id));
drop policy if exists sessions_read on public.felipe_sessions;
create policy sessions_read on public.felipe_sessions for select to authenticated
 using(public.owns_personal_student(student_id) or public.teaches_personal_student(student_id));
drop policy if exists sessions_insert on public.felipe_sessions;
create policy sessions_insert on public.felipe_sessions for insert to authenticated
 with check(public.owns_personal_student(student_id) and status='draft' and revision=0 and submitted_at is null);
drop policy if exists sessions_update on public.felipe_sessions;
create policy sessions_update on public.felipe_sessions for update to authenticated
 using(public.owns_personal_student(student_id) and status='draft')
 with check(public.owns_personal_student(student_id));

create or replace function public.guard_felipe_session()
returns trigger language plpgsql set search_path='' as $$
begin
 if new.id<>old.id or new.student_id<>old.student_id or new.version<>old.version or new.created_at<>old.created_at then
  raise exception 'A identidade da avaliação não pode ser alterada.';
 end if;
 if old.status='submitted' then raise exception 'Avaliação já enviada; respostas preservadas.'; end if;
 new.revision:=old.revision+1; new.updated_at:=now();
 if new.status='submitted' then
  if new.evidence->>'consent' is distinct from 'true' then raise exception 'Confirme a autorização de uso pedagógico.'; end if;
  new.submitted_at:=now();
 else new.submitted_at:=null; end if;
 return new;
end; $$;
drop trigger if exists guard_felipe_session on public.felipe_sessions;
create trigger guard_felipe_session before update on public.felipe_sessions
 for each row execute function public.guard_felipe_session();

drop policy if exists reviews_teacher on public.felipe_reviews;
create policy reviews_teacher on public.felipe_reviews for all to authenticated
 using(exists(select 1 from public.felipe_sessions x where x.id=session_id and public.teaches_personal_student(x.student_id)))
 with check(exists(select 1 from public.felipe_sessions x where x.id=session_id and x.status='submitted' and public.teaches_personal_student(x.student_id)));
drop policy if exists reviews_student on public.felipe_reviews;
create policy reviews_student on public.felipe_reviews for select to authenticated
 using(published and exists(select 1 from public.felipe_sessions x where x.id=session_id and public.owns_personal_student(x.student_id)));
drop policy if exists materials_teacher on public.personal_materials;
create policy materials_teacher on public.personal_materials for all to authenticated
 using(public.teaches_personal_student(student_id)) with check(public.teaches_personal_student(student_id));
drop policy if exists materials_student on public.personal_materials;
create policy materials_student on public.personal_materials for select to authenticated
 using(published and public.owns_personal_student(student_id));
drop policy if exists completions_read on public.personal_completions;
create policy completions_read on public.personal_completions for select to authenticated
 using(exists(select 1 from public.personal_materials m where m.id=material_id and
 (public.owns_personal_student(m.student_id) or public.teaches_personal_student(m.student_id))));
drop policy if exists completions_insert on public.personal_completions;
create policy completions_insert on public.personal_completions for insert to authenticated
 with check(exists(select 1 from public.personal_materials m where m.id=material_id and m.published and public.owns_personal_student(m.student_id)));

revoke all on public.personal_spaces,public.felipe_sessions,public.felipe_reviews,public.personal_materials,public.personal_completions from anon,authenticated;
grant select on public.personal_spaces to authenticated;
grant select,insert,update on public.felipe_sessions to authenticated;
grant select,insert,update,delete on public.felipe_reviews,public.personal_materials to authenticated;
grant select,insert on public.personal_completions to authenticated;
grant all on public.personal_spaces,public.felipe_sessions,public.felipe_reviews,public.personal_materials,public.personal_completions to service_role;

-- Ligação atômica de conta Auth e perfil. Apenas a Edge Function (service_role) executa.
create or replace function public.provision_personal_student(
 p_teacher uuid,p_auth uuid,p_username text,p_name text,p_existing uuid default null
) returns uuid language plpgsql security definer set search_path='' as $$
declare sid uuid;
begin
 if not exists(select 1 from public.profiles where id=p_teacher and role='teacher') then raise exception 'Professor inválido.'; end if;
 if not exists(select 1 from auth.users where id=p_auth and is_anonymous=false) then raise exception 'Conta inválida.'; end if;
 if p_existing is not null then
  select id into sid from public.students where id=p_existing and teacher_id=p_teacher for update;
  if sid is null then raise exception 'Aluno não pertence ao professor.'; end if;
  if exists(select 1 from public.personal_spaces where student_id=sid) then raise exception 'Aluno já tem usuário; use redefinir senha.'; end if;
  update public.students set auth_user_id=p_auth where id=sid;
 else
  insert into public.students(teacher_id,auth_user_id,first_name,guardian_consent_at,access_code_hash)
   values(p_teacher,p_auth,p_name,now(),extensions.crypt(gen_random_uuid()::text,extensions.gen_salt('bf')))
   returning id into sid;
 end if;
 insert into public.personal_spaces(student_id,username) values(sid,p_username);
 update public.profiles set display_name=p_name where id=p_auth;
 return sid;
end; $$;
revoke all on function public.provision_personal_student(uuid,uuid,text,text,uuid) from public,anon,authenticated;
grant execute on function public.provision_personal_student(uuid,uuid,text,text,uuid) to service_role;

-- O botão de código legado não pode desvincular alunos migrados para senha.
create or replace function public.reset_student_access(p_student_id uuid,p_new_access_code text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.teaches_personal_student(p_student_id) then raise exception 'Acesso não permitido.'; end if;
 if exists(select 1 from public.personal_spaces where student_id=p_student_id) then raise exception 'Este aluno usa senha. Abra Área individual para redefinir.'; end if;
 if char_length(trim(p_new_access_code))<8 then raise exception 'Mínimo de 8 caracteres.'; end if;
 if exists(select 1 from public.students where id<>p_student_id and active and
 extensions.crypt(upper(trim(p_new_access_code)),access_code_hash)=access_code_hash) then raise exception 'Código já utilizado.'; end if;
 update public.students set auth_user_id=null,access_code_hash=extensions.crypt(upper(trim(p_new_access_code)),extensions.gen_salt('bf')) where id=p_student_id;
end; $$;

-- Áudios opcionais de Felipe: bucket privado, limite 15 MiB por gravação.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('felipe-audio','felipe-audio',false,15728640,array['audio/webm','audio/mp4','audio/ogg','audio/wav'])
 on conflict(id) do nothing;
create or replace function public.can_read_felipe_audio(object_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.felipe_sessions x where
 x.student_id::text=split_part(object_name,'/',1) and x.id::text=split_part(object_name,'/',2)
 and (public.owns_personal_student(x.student_id) or public.teaches_personal_student(x.student_id)));
$$;
create or replace function public.can_write_felipe_audio(object_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.felipe_sessions x where
 x.student_id::text=split_part(object_name,'/',1) and x.id::text=split_part(object_name,'/',2)
 and x.status='draft' and x.evidence->>'audioConsent'='true' and public.owns_personal_student(x.student_id));
$$;
revoke all on function public.can_read_felipe_audio(text),public.can_write_felipe_audio(text) from public;
grant execute on function public.can_read_felipe_audio(text),public.can_write_felipe_audio(text) to authenticated;
drop policy if exists felipe_audio_read on storage.objects;
create policy felipe_audio_read on storage.objects for select to authenticated
 using(bucket_id='felipe-audio' and public.can_read_felipe_audio(name));
drop policy if exists felipe_audio_insert on storage.objects;
create policy felipe_audio_insert on storage.objects for insert to authenticated
 with check(bucket_id='felipe-audio' and public.can_write_felipe_audio(name));
drop policy if exists felipe_audio_delete on storage.objects;
create policy felipe_audio_delete on storage.objects for delete to authenticated
 using(bucket_id='felipe-audio' and (public.can_write_felipe_audio(name) or exists(
 select 1 from public.felipe_sessions x where x.student_id::text=split_part(name,'/',1)
 and x.id::text=split_part(name,'/',2) and public.teaches_personal_student(x.student_id))));

commit;
