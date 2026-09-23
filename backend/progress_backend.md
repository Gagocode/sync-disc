## 2026-09-22

### Funcionalidade
Fluxo principal DISC, missoes e XP automaticos

### Arquivos alterados
backend/repositories/disc_repository.py, backend/repositories/mission_repository.py, backend/services/mission_service.py, backend/services/disc_service.py, backend/services/project_service.py, backend/services/certificate_service.py, backend/services/profile_service.py, backend/controllers/disc_controller.py, backend/controllers/page_controller.py, backend/controllers/auth_controller.py, backend/controllers/mission_controller.py

### Resumo
O Dashboard passou a exigir DISC Inicial concluido e perfil inicial gerado, com redirecionamento automatico para o quiz quando o usuario ainda nao possui resultado e para o perfil quando a classe inicial ainda nao foi persistida. O DISC Inicial deixou de ser sobrescrito e, apos concluido, a rota do quiz exibe o resultado existente. O catalogo de missoes foi ampliado com DISC, perfil, primeiro/segundo projeto, primeiro/segundo certificado e uma missao final de continuidade, com ativacao automatica da proxima missao e conclusao por eventos de dominio. O endpoint manual de conclusao de missao foi removido.

### Impacto
O fluxo Cadastro/Login -> DISC Inicial -> Perfil Inicial -> Dashboard fica protegido no backend. Missoes passam a conceder XP automaticamente no momento da acao correspondente e o usuario recebe uma proxima missao disponivel sem depender de clique manual.

## 2026-09-18

### Funcionalidade
Perfil publico do usuario

### Arquivos alterados
backend/app.py, backend/repositories/user_repository.py, backend/services/public_profile_service.py, backend/controllers/public_profile_controller.py

### Resumo
Implementada pagina publica acessivel por /profile/<id> sem autenticacao. O perfil publico exibe dados publicos do usuario, classe, XP, DISC Inicial, projetos, certificados e indicadores basicos.

### Impacto
Terceiros passam a visualizar o Curriculo Vivo do usuario de forma simples e compartilhavel, sem sistema social, curtidas, comentarios ou compartilhamento em redes.

## 2026-09-18

### Funcionalidade
Cadastro de certificados do Curriculo Vivo

### Arquivos alterados
backend/app.py, backend/database/schema.sql, backend/models/certificate.py, backend/repositories/certificate_repository.py, backend/services/certificate_service.py, backend/services/profile_service.py, backend/controllers/certificate_controller.py, backend/controllers/profile_controller.py, backend/uploads/certificates/.gitkeep

### Resumo
Implementado CRUD autenticado de certificados com nome, instituicao, carga horaria, data de conclusao e upload local opcional. Certificados foram integrados ao perfil do usuario e a criacao do primeiro certificado conclui automaticamente a missao correspondente.

### Impacto
Usuarios passam a registrar certificados no Curriculo Vivo com persistencia em SQLite, upload local simples e concessao de XP apenas uma vez pela missao de primeiro certificado.

## 2026-09-18

### Funcionalidade
Cadastro de projetos do Curriculo Vivo

### Arquivos alterados
backend/app.py, backend/database/schema.sql, backend/models/project.py, backend/repositories/project_repository.py, backend/repositories/mission_repository.py, backend/services/project_service.py, backend/services/mission_service.py, backend/services/profile_service.py, backend/controllers/project_controller.py, backend/controllers/profile_controller.py

### Resumo
Implementado CRUD autenticado de projetos com titulo, descricao, tecnologias, link opcional e data de criacao. Projetos foram integrados ao perfil do usuario e a criacao do primeiro projeto conclui automaticamente a missao correspondente.

### Impacto
Usuarios passam a construir a parte inicial do Curriculo Vivo com projetos persistidos no SQLite, recebendo XP apenas uma vez pela missao de primeiro projeto.

## 2026-09-18

### Funcionalidade
Sistema de missoes fixas do MVP

### Arquivos alterados
backend/app.py, backend/database/schema.sql, backend/models/mission.py, backend/repositories/mission_repository.py, backend/repositories/user_repository.py, backend/services/auth_service.py, backend/services/mission_service.py, backend/controllers/mission_controller.py

### Resumo
Implementado o sistema inicial de missoes fixas com criacao automatica para novos usuarios, listagem, conclusao, status pendente/concluida e concessao de XP ao concluir cada missao uma unica vez.

### Impacto
Usuarios passam a possuir missoes persistidas no SQLite e podem concluir missoes fixas do MVP para evoluir XP, sem missoes adaptativas, recomendacao ou DISC observado.

## 2026-09-18

### Funcionalidade
Perfil inicial do usuario

### Arquivos alterados
backend/app.py, backend/database/connection.py, backend/database/schema.sql, backend/models/user.py, backend/repositories/user_repository.py, backend/services/profile_service.py, backend/controllers/profile_controller.py

### Resumo
Implementada a primeira versao do perfil autenticado com dados do usuario, XP inicial, classe persistida e resumo do DISC Inicial. A classe e calculada na camada de service a partir da dimensao predominante do DISC Inicial.

### Impacto
Usuarios autenticados passam a visualizar seu perfil inicial com dados pessoais, XP, classe e resultado DISC, sem implementar niveis, atributos evolutivos ou DISC observado.

## 2026-09-18

### Funcionalidade
Quiz Narrativo DISC Inicial

### Arquivos alterados
backend/app.py, backend/database/schema.sql, backend/models/disc_result.py, backend/repositories/disc_repository.py, backend/services/disc_service.py, backend/controllers/disc_controller.py

### Resumo
Implementado o Quiz Narrativo DISC Inicial com 12 perguntas situacionais, calculo de pontuacao por dimensao, percentual por D/I/S/C, dimensao predominante e persistencia do resultado inicial no SQLite.

### Impacto
Usuarios autenticados passam a conseguir responder o quiz, salvar o resultado DISC Inicial e visualizar seus percentuais sem implementar DISC observado, evolucao automatica ou historico.

## 2026-09-18

### Funcionalidade
Autenticacao basica do MVP

### Arquivos alterados
backend/app.py, backend/database/connection.py, backend/database/schema.sql, backend/models/user.py, backend/repositories/user_repository.py, backend/services/auth_service.py, backend/controllers/auth_controller.py, backend/controllers/page_controller.py

### Resumo
Implementado cadastro, login, logout e sessao autenticada com Flask session. Criada tabela users no SQLite com email unico e senha armazenada por hash seguro. Separadas responsabilidades entre controllers, services, repositories e models.

### Impacto
O MVP passa a permitir autenticacao basica por sessao, com rotas protegidas exigindo usuario autenticado e persistencia inicial da entidade Usuario.

## 2026-09-18

### Funcionalidade
Estrutura inicial do backend

### Arquivos alterados
backend/app.py, backend/requirements.txt, backend/controllers/__init__.py, backend/services/__init__.py, backend/repositories/__init__.py, backend/models/__init__.py, backend/database/__init__.py, backend/database/connection.py, backend/database/schema.sql, backend/uploads/.gitkeep

### Resumo
Criada a organizacao base em camadas com controllers, services, repositories, models, database e uploads. Adicionado app Flask minimo, requirements.txt e configuracao inicial para conexao SQLite sem tabelas de dominio.

### Impacto
O backend passa a ter uma base organizada para desenvolvimento futuro, preservando separacao de responsabilidades e sem implementar regras de negocio.
## 2026-09-22

### Funcionalidade
Catalogo persistido e progressao automatica de missoes

### Arquivos alterados
backend/database/schema.sql, backend/models/mission.py, backend/repositories/mission_repository.py, backend/services/mission_service.py, backend/services/project_service.py, backend/services/certificate_service.py

### Resumo
Criada a tabela de catalogo `missions` com id, nome, descricao, XP, ordem e tipo de evento. O service sincroniza o catalogo, gera o progresso individual a partir dele e ativa a proxima missao bloqueada automaticamente. Foram adicionadas as missoes de terceiro projeto e terceiro certificado.

### Impacto
O painel passa a receber uma jornada persistente com missao ativa e proximas missoes. Cada conclusao concede XP uma unica vez, registra a data e nao permite reativar uma missao concluida.
