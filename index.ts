// Deploy as manage-personal-student in Supabase. No secrets belong in the frontend.
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const origin = 'https://gpaixaolab-cmyk.github.io';
const headers = {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json','Vary':'Origin'};
const json=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers});

Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers});
 if(req.method!=='POST') return json(405,{error:'Método inválido.'});
 if(req.headers.get('origin') && req.headers.get('origin')!==origin) return json(403,{error:'Origem não permitida.'});
 const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
 if(!token) return json(401,{error:'Entre como professor.'});
 const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 if(!url||!key) return json(503,{error:'Função ainda não configurada.'});
 const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error:authError}=await admin.auth.getUser(token);
 if(authError||!user||user.is_anonymous) return json(401,{error:'Sessão inválida.'});
 const {data:profile,error:roleError}=await admin.from('profiles').select('role').eq('id',user.id).single();
 if(roleError||profile?.role!=='teacher') return json(403,{error:'Exclusivo do professor.'});
 try{
  const raw=await req.text();
  if(raw.length>4000) return json(413,{error:'Pedido muito grande.'});
  const body=JSON.parse(raw);
  if(typeof body.password!=='string'||body.password.length<10||body.password.length>128) return json(400,{error:'Use uma senha entre 10 e 128 caracteres.'});
  if(body.action==='reset'){
   const {data:student}=await admin.from('students').select('id,auth_user_id').eq('id',body.studentId).eq('teacher_id',user.id).single();
   if(!student?.auth_user_id) return json(404,{error:'Aluno não encontrado.'});
   const {data:space}=await admin.from('personal_spaces').select('username').eq('student_id',student.id).single();
   if(!space) return json(400,{error:'Aluno ainda não usa senha.'});
   const {data:target,error:targetError}=await admin.auth.admin.getUserById(student.auth_user_id);
   if(targetError||!target.user||target.user.app_metadata?.portal_student!==true||target.user.email!==space.username+'@students.fylab.invalid') return json(403,{error:'Vínculo de conta inválido. A senha não foi alterada.'});
   const {error}=await admin.auth.admin.updateUserById(student.auth_user_id,{password:body.password});
   return error?json(400,{error:'Não foi possível redefinir a senha.'}):json(200,{ok:true,username:space.username});
  }
  if(body.action!=='create'||body.consent!==true) return json(400,{error:'Confirme a autorização de uso pedagógico.'});
  const username=String(body.username||'').trim().toLowerCase(),name=String(body.name||'').trim();
  if(!/^[a-z0-9][a-z0-9._-]{2,29}$/.test(username)||!name||name.length>60) return json(400,{error:'Confira nome e usuário (3–30 letras, números, ponto, hífen ou sublinhado).'});
  if(body.existingId){
   const {data:existing}=await admin.from('students').select('id').eq('id',body.existingId).eq('teacher_id',user.id).single();
   if(!existing) return json(403,{error:'Aluno existente não pertence ao professor.'});
  }
  const {data:duplicate}=await admin.from('personal_spaces').select('student_id').eq('username',username).maybeSingle();
  if(duplicate) return json(409,{error:'Usuário indisponível. Escolha outro.'});
  // Internal alias only; never sends mail to the student. No personal email required.
  const {data:created,error:createError}=await admin.auth.admin.createUser({email:username+'@students.fylab.invalid',password:body.password,email_confirm:true,user_metadata:{display_name:name},app_metadata:{portal_student:true}});
  if(createError||!created.user) return json(400,{error:'Não foi possível criar a conta. Confira a política de senha e se o usuário já existe.'});
  const {data:sid,error:linkError}=await admin.rpc('provision_personal_student',{p_teacher:user.id,p_auth:created.user.id,p_username:username,p_name:name,p_existing:body.existingId||null});
  if(linkError){
   // Compensate only the account created by this request. Never delete existing records.
   await admin.auth.admin.deleteUser(created.user.id);
   return json(400,{error:'Não foi possível vincular o cadastro. Confira a migração do banco e se o aluno já possui usuário.'});
  }
  return json(200,{ok:true,studentId:sid,username});
 }catch{return json(400,{error:'Pedido inválido ou serviço indisponível. Confira o cadastro antes de repetir.'});}
});
