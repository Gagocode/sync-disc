## 2026-09-22

### Funcionalidade
Fluxo principal DISC e missoes automaticas

### Arquivos alterados
frontend/pages/missoes.html, frontend/pages/disc_quiz.html, frontend/pages/disc_result.html, frontend/pages/index.html

### Resumo
Removida a acao manual de concluir missao da tela de missoes. A tela de resultado DISC passou a informar que o DISC Inicial ja foi registrado e nao pode ser refeito. O Dashboard deixou de oferecer link de refazer o quiz, mantendo apenas a consulta ao resultado.

### Impacto
A interface passa a refletir o fluxo principal definido para o produto: o DISC Inicial e obrigatorio, nao e repetivel, e a progressao por missoes/XP acontece automaticamente a partir das acoes do usuario.

## 2026-09-18

### Funcionalidade
Pagina de perfil publico

### Arquivos alterados
frontend/pages/perfil_publico.html, frontend/pages/index.html, frontend/pages/perfil.html, frontend/assets/css/style.css

### Resumo
Criada pagina publica simples para exibir nome, curso, classe, XP, DISC Inicial, projetos, certificados e indicadores basicos. Adicionados links para acesso ao perfil publico pelo painel e perfil autenticado.

### Impacto
O frontend passa a apresentar o Curriculo Vivo em uma visao publica clara para recrutadores, professores e colegas, sem funcionalidades sociais.

## 2026-09-18

### Funcionalidade
Interface de certificados do Curriculo Vivo

### Arquivos alterados
frontend/pages/certificados.html, frontend/pages/certificado_form.html, frontend/pages/certificado_detalhe.html, frontend/pages/perfil.html, frontend/pages/index.html, frontend/assets/css/style.css

### Resumo
Criadas telas simples para listar, criar, visualizar, editar e excluir certificados com upload opcional. O perfil passou a exibir automaticamente os certificados cadastrados pelo usuario.

### Impacto
O frontend passa a oferecer o fluxo basico de cadastro de certificados do Curriculo Vivo, sem OCR, validacao externa ou integracoes.

## 2026-09-18

### Funcionalidade
Interface de projetos do Curriculo Vivo

### Arquivos alterados
frontend/pages/projetos.html, frontend/pages/projeto_form.html, frontend/pages/projeto_detalhe.html, frontend/pages/perfil.html, frontend/pages/index.html, frontend/assets/css/style.css

### Resumo
Criadas telas simples para listar, criar, visualizar, editar e excluir projetos. O perfil passou a exibir automaticamente os projetos cadastrados pelo usuario.

### Impacto
O frontend passa a oferecer o fluxo basico de cadastro de projetos do Curriculo Vivo, priorizando funcionamento sem workflow extra ou anexos complexos.

## 2026-09-18

### Funcionalidade
Pagina de missoes fixas

### Arquivos alterados
frontend/pages/missoes.html, frontend/pages/index.html, frontend/pages/perfil.html, frontend/assets/css/style.css

### Resumo
Criada pagina simples de missoes exibindo nome, descricao, status e XP de recompensa, com acao para concluir missoes pendentes. Adicionados links para acesso pelo painel e perfil.

### Impacto
O frontend passa a permitir visualizacao clara de missoes pendentes e concluidas, alem da conclusao manual das missoes fixas do MVP.

## 2026-09-18

### Funcionalidade
Pagina de perfil inicial

### Arquivos alterados
frontend/pages/perfil.html, frontend/pages/index.html, frontend/assets/css/style.css

### Resumo
Criada pagina autenticada de perfil com dados do usuario, XP, classe inicial e resultado DISC Inicial. Atualizado o painel autenticado com link para o perfil.

### Impacto
O frontend passa a exibir uma visao simples e organizada do perfil inicial do MVP, sem adicionar funcionalidades fora do escopo.

## 2026-09-18

### Funcionalidade
Interface do Quiz DISC Inicial

### Arquivos alterados
frontend/pages/disc_quiz.html, frontend/pages/disc_result.html, frontend/pages/index.html, frontend/assets/css/style.css

### Resumo
Criadas telas simples para responder o Quiz Narrativo DISC Inicial e visualizar o resultado com percentuais e dimensao predominante. Atualizado o painel autenticado com links para o quiz e resultado.

### Impacto
O frontend passa a oferecer o fluxo basico para realizacao e visualizacao do DISC Inicial, priorizando funcionamento sem design avancado.

## 2026-09-18

### Funcionalidade
Telas de cadastro e login

### Arquivos alterados
frontend/pages/cadastro.html, frontend/pages/login.html, frontend/pages/index.html, frontend/assets/css/style.css

### Resumo
Criadas telas simples de cadastro e login integradas aos endpoints de autenticacao por formulario. Atualizada a pagina inicial para funcionar como area autenticada basica com acao de logout.

### Impacto
O frontend passa a suportar o fluxo basico do MVP para cadastro, entrada, sessao autenticada e encerramento de sessao.

## 2026-09-18

### Funcionalidade
Estrutura inicial do frontend

### Arquivos alterados
frontend/pages/index.html, frontend/assets/css/style.css, frontend/assets/js/main.js, frontend/assets/images/.gitkeep

### Resumo
Criada a estrutura base com pages e assets separados em css, js e images. Adicionados arquivos iniciais de HTML, CSS e JavaScript para suportar evolucao futura da interface.

### Impacto
O frontend passa a ter uma base organizada para desenvolvimento futuro, sem implementar fluxos de produto ou regras de negocio.
## 2026-09-23

### Funcionalidade
Dashboard autenticado em tela única

### Arquivos alterados
frontend/pages/index.html, frontend/assets/css/style.css, frontend/assets/js/main.js

### Resumo
Reestruturada a Home como centro da experiência autenticada, reunindo perfil, XP, progresso, DISC, missão ativa, próximas missões, Currículo Vivo e indicadores de evolução. A interface passou a consumir os endpoints existentes para atualizar os cards sem criar novas regras ou funcionalidades.

### Impacto
A experiência reduz a fragmentação entre telas, dá destaque às missões e torna projetos e certificados visíveis como evidências do Currículo Vivo, com adaptação para desktop, notebook e tablet.
