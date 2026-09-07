# Ativar a área individual de Felipe

Esta atualização foi preparada para o repositório `gpaixaolab-cmyk/fylab-personal-classes` e para o Supabase já usado pelo portal. Ainda não foi aplicada ao site ou ao banco de produção. Não existe uma senha de Felipe criada por esta entrega.

O fluxo preparado é: professor cria o acesso → Felipe entra com usuário e senha → respostas são salvas no banco → professor revisa as habilidades → publica o parecer e os materiais → Felipe recebe tudo em sua área.

## 1. Atualizar o banco primeiro

No projeto Supabase **Fylab Personal Classes**, abra **SQL Editor → New query**. Abra o arquivo `supabase/02-felipe.sql` deste pacote, copie TODO o conteúdo, cole e clique em **Run**. O resultado esperado é sucesso sem erro. Se aparecer erro, pare e envie a mensagem; não desligue as regras de segurança.

É uma atualização sobre o banco existente, não uma instalação nova. Ela adiciona tabelas e políticas e preserva Alice. Não execute novamente o `schema.sql` antigo: ele contém a configuração inicial, substituída em parte por esta atualização. Faça uma cópia dos dados importantes antes de qualquer alteração em produção.

## 2. Ativar o cadastro seguro no Supabase

Abra **Edge Functions → Deploy a new function → Via Editor**. Dê o nome exato **manage-personal-student**. Substitua o conteúdo do arquivo `index.ts` no editor pelo conteúdo de `supabase/functions/manage-personal-student/index.ts` do pacote. Clique em **Deploy function**.

Na tela deste projeto, a opção tem o nome **Verify JWT with legacy secret**. Desative essa verificação específica e clique em **Save changes**. Ela pode bloquear sessões assinadas com as novas chaves. O código completo fornecido continua exigindo autenticação: verifica o token no Supabase Auth com `auth.getUser(token)`, exige perfil de professor e confere o vínculo do aluno antes de alterar uma senha. Não remova essas verificações do código. A configuração de implantação correspondente é `verify_jwt = false`. Esta orientação corrige a versão inicial do guia conforme a opção exibida no painel do projeto. [Compatibilidade das chaves com Edge Functions](https://supabase.com/docs/guides/auth/signing-keys).

A função usa as variáveis internas de servidor `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`, fornecidas no ambiente das funções do Supabase. Não copie a chave de administrador para o site, para o GitHub ou para a conversa. Se a função informar que está sem configuração, confira seu ambiente no Supabase, sem divulgar as chaves. [Variáveis das funções](https://supabase.com/docs/guides/functions/secrets).

O editor permite essa implantação sem instalar programas. [Instruções oficiais do editor](https://supabase.com/docs/guides/functions/quickstart-dashboard).

## 3. Atualizar o site no GitHub

Extraia o ZIP. Na página principal do repositório, clique em **Add file → Upload files**. Envie as pastas e arquivos que estão DENTRO do ZIP, para a raiz do repositório — não envie a pasta que envolve o pacote e não envie o próprio ZIP.

Os arquivos principais devem ficar exatamente em `components/felipe-space.tsx`, `components/portal-shell.tsx` e `lib/felipe-assessment.ts`, e não em uma subpasta chamada FYLAB ou ATUALIZACAO. Preserve os outros arquivos existentes. Confirme em **Commit changes** e espere a execução mais recente de **Actions** terminar com o indicador verde.

Este pacote é uma atualização, não o projeto completo: não apague o repositório para instalá-lo. Não contém novas dependências de produção e não precisa substituir `package.json` ou `package-lock.json`.

O endereço esperado com o nome atual é:

[FYLAB Personal Classes](https://gpaixaolab-cmyk.github.io/fylab-personal-classes/)

Em **Settings → Pages** do GitHub, confirme o endereço realmente publicado. No Supabase, **Authentication → URL Configuration**, mantenha **Site URL** com esse endereço e autorize esse mesmo destino para os redirecionamentos. Se houver domínio próprio, a origem permitida na função também precisará ser atualizada. Esta entrega não alterou essas configurações externas.

## 4. Criar Felipe pelo painel do professor

Entre no site como professor, com seu e-mail e sua senha atuais. Abra **Área individual → Criar acesso com usuário e senha**.

- Nome: Felipe.
- Usuário: `felipe`, ou outro disponível, sem espaços e sem acentos.
- Senha inicial: crie uma senha exclusiva com pelo menos 10 caracteres. Não use a senha do professor.
- Confirme a autorização de uso pedagógico; se Felipe for menor, ela deve ser do responsável.
- Clique em **Criar e vincular área individual**.

Deixe **Criar aluno novo** selecionado se Felipe ainda não foi cadastrado. Se ele já existe, selecione APENAS o cadastro dele para conservar o histórico e substituir o acesso por código. Não selecione Alice: ela continua no fluxo anterior.

Envie o link, o usuário e a senha de Felipe por um canal privado. Ele entra em **Sou aluno**. Não precisa ter e-mail pessoal nem criar conta no GitHub. O sistema usa um identificador interno no Supabase Auth; a senha é gerenciada pelo Auth, não por tabelas de texto do portal. A redefinição é feita pelo professor na própria Área individual, e não por e-mail. [Criação administrativa de contas](https://supabase.com/docs/reference/javascript/auth-admin-createuser).

## 5. Conferir a ligação antes do exame real

Faça primeiro um teste com um cadastro separado chamado `Teste`, sem dados pessoais, para não consumir a tentativa diagnóstica de Felipe. Use duas sessões de navegador: professor no computador e aluno em outro perfil ou dispositivo. Não teste entrando como Felipe no mesmo navegador do professor, pois a sessão será substituída.

1. No aluno de teste, inicie o diagnóstico e escreva uma resposta. Espere **Salvo no banco**. Use **Salvar e pausar**, saia e entre de novo: a resposta deve continuar lá.
2. No professor, abra **Área individual** e atualize os dados: deve aparecer **Em andamento**, a etapa e a resposta.
3. Publique um material para esse aluno. Na área dele, atualize, abra e marque como concluído. Atualize o professor: a conclusão deve aparecer.
4. Para testar o envio com poucas respostas, indique envio parcial. As lacunas devem permanecer explícitas. Confirme a autorização e envie. O professor deve ver **Enviado para revisão**.
5. No professor, registre evidências ou a razão de não avaliação em cada habilidade, condições e plano. Monte o texto e salve um rascunho: o aluno NÃO deve vê-lo. Publique: ao atualizar a área do aluno, o texto deve aparecer.
6. Teste áudio no aparelho que será usado na aula. Sem microfone ou sem autorização, use a conversa ao vivo e anote as evidências. Se gravar, clique em **Guardar gravação privada** e depois confira o salvamento. O professor deve conseguir ouvir a amostra; outro aluno não deve acessá-la.
7. Confira que o acesso e o histórico de Alice continuam disponíveis pela opção de código antigo ou pela sessão que ela já usa.

Não aplique o diagnóstico real até esses testes passarem. Não marque tarefas como realizadas no cadastro real apenas para experimentar o painel. O administrador pode remover o cadastro e os dados de teste posteriormente; não foi incluída exclusão automática de alunos.

## O que foi verificado nesta entrega

A compilação estática para o novo caminho do GitHub Pages e o TypeScript foram verificados. Há testes de regras do banco em PostgreSQL local/WASM com o esquema anterior e a migração, incluindo preservação de Alice, isolamento entre alunos e professores, salvamento por revisão, respostas imutáveis após envio, publicação do parecer e permissões de áudio. Há testes adicionais do contrato da função com o serviço Auth simulado e da estrutura das questões.

Esses testes NÃO são uma implantação nem uma verificação no seu Supabase. Login real, função publicada, upload/reprodução no tablet e as duas sessões de professor/aluno precisam da conferência acima. Sem conexão administrativa autorizada, esta entrega não criou contas reais, não alterou senhas e não publicou no GitHub.

## Limitações que importam

- Não há inteligência artificial contratada para classificar pronúncia ou gerar um nível automaticamente. A avaliação oral e a interpretação do CEFR são do professor; o site organiza as evidências e monta o texto com suas observações.
- A escuta usa síntese de voz do navegador ou leitura padronizada pelo professor. Voz, velocidade e qualidade podem variar; registre as condições. Não é áudio natural padronizado de um exame certificado.
- O aluno pode pausar e retomar, mas precisa de internet para salvar. Não há sincronização offline. Se aparecer **Não salvo**, não feche a página: copie o texto e restabeleça a conexão. Dois dispositivos editando a mesma tentativa não se sobrepõem silenciosamente; um conflito pede recarga.
- Há uma tentativa por aluno nesta versão diagnóstica. Depois do envio, não é possível editar respostas. Uma reavaliação formal deve ter nova versão e novas tarefas.
- Dados são atualizados pelo botão **Atualizar**; não foi implementada atualização instantânea por assinatura em tempo real.
- Áudio é opcional, privado e limitado a seis minutos/15 MiB por gravação. Links de reprodução vencem em cinco minutos. Microfone do navegador não garante captar o áudio remoto do professor na chamada; avalie a interação ao vivo.
- Regravações podem deixar arquivos anteriores no bucket. Defina retenção pedagógica, revise os arquivos no Supabase Storage e exclua os que não são necessários. Não há rotina automática de retenção nem lixeira de gravações nesta atualização.
- Não há compra de serviço de IA. O consumo de hospedagem, banco, funções e armazenamento continua sujeito ao plano e às cotas das suas contas; não é promessa de gratuidade ilimitada.

As orientações pedagógicas completas estão em `docs/GUIA-PROFESSOR-FELIPE.md`.
