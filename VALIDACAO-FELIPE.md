# Registro de validação — 7 de setembro de 2026

## Resultados executados

- Build de produção Next.js 16.2.6 com `GITHUB_ACTIONS=true` e `GITHUB_REPOSITORY=gpaixaolab-cmyk/fylab-personal-classes`: aprovado, exportação estática gerada e TypeScript sem erros.
- `tests/felipe-database.mjs`: 33 verificações aprovadas em PostgreSQL/WASM (PGlite 0.3.15), com extensão pgcrypto real, esquema anterior e migração aplicados duas vezes.
- `tests/felipe-contracts.mjs`: 28 verificações aprovadas para estrutura da avaliação e comportamento do cadastro seguro, com respostas do Supabase Auth simuladas.

## Cobertura

Preservação do vínculo de Alice; professor existente preservado; novos usuários não ganham papel de professor; separação de cursos anteriores; RLS entre dois alunos e dois professores; bloqueio da chave pública sem sessão; professor acompanha rascunho; consentimento para envio; bloqueio de tentativa duplicada e troca de dono; revisão incremental contra gravação concorrente; congelamento de respostas enviadas; aluno não cria parecer; rascunho do professor oculto e publicação visível apenas ao destinatário; material individual e conclusão; acesso privado aos registros de áudio; upload restrito ao próprio rascunho autorizado; proteção contra redefinição pelo código legado; verificação de vínculo Auth antes de redefinir senha; compensação limitada à conta recém-criada quando falha o vínculo.

## Não verificado em produção

O teste usa um banco local descartável, não o Supabase real. O serviço Auth é simulado nos testes da função. Não houve implantação da função, criação de Felipe em produção, alteração de senha, gravação no GitHub, execução de GitHub Actions, login real em tablet nem teste completo de navegador professor/aluno. Os testes de Storage verificam políticas SQL sobre os registros, não a transferência real de um arquivo ao serviço.

O arquivo `docs/COMECE-AQUI-FELIPE.md` inclui a conferência obrigatória de aceitação após a ativação. A aprovação local não substitui essa conferência.

## Reproduzir

No repositório instalado com `npm ci`:

```sh
node tests/felipe-contracts.mjs
GITHUB_ACTIONS=true GITHUB_REPOSITORY=gpaixaolab-cmyk/fylab-personal-classes npm run build
```

O teste de banco usa uma dependência somente de teste, fora das dependências de produção:

```sh
npm install --prefix /tmp/felipe-test-deps @electric-sql/pglite@0.3.15
FELIPE_TEST_DEPS=/tmp/felipe-test-deps/node_modules node tests/felipe-database.mjs
```

Não aponte esses testes para um banco real. As contas e senhas de fixture são fictícias, locais e sem valor de acesso.
