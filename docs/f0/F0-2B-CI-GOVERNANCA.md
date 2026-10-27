# F0.2B — CI e Governança de Publicação

**Data:** 27/10/2026  
**Branch:** `audit/f0-estabilizacao-20261027`  
**Commit-base:** `1c98a31ba79acdd157afcfb47296872bd49a9981`  
**Referências:** [`BASELINE-TECNICO.md`](BASELINE-TECNICO.md) e [`F0-2A-DEPENDENCIAS.md`](F0-2A-DEPENDENCIAS.md)

## Resultado

**Recomendação: aprovar a implementação local da F0.2B, com ativação remota pendente.** O workflow foi criado e validado estaticamente e a sequência de CI passou localmente com Node.js 24. A execução no GitHub e a proteção da `main` continuam pendentes: esta branch não foi publicada e a regra não foi configurada remotamente. Portanto, ainda não há check remoto selecionável nem evidência de execução pelo GitHub Actions.

## Implementação

Foi criado `.github/workflows/validate-pr.yml`, independente do deploy, com:

- Evento `pull_request` limitado a branches de destino `main`.
- Node.js `24` via `actions/setup-node@v4`, com cache npm.
- Instalação reproduzível por `npm ci`.
- Etapas `npm run typecheck`, `npm run lint` e `npm audit --omit=dev`.
- Build `npm run build` com `NEXT_PUBLIC_BASE_PATH=/instituto-semeando-futuro` e URL do site derivada dos metadados do repositório.
- Verificação de `out/index.html`, `out/404.html`, `out/manifest.webmanifest`, `out/robots.txt`, `out/sitemap.xml` e pelo menos um CSS em `out/_next/static/css/`.
- Permissão explícita única `contents: read`, aplicada ao workflow e herdada pelo job. Não há permissão de escrita, `pages: write`, `id-token: write`, upload de artefato de Pages ou ação de deploy.
- Concorrência limitada ao número do PR, cancelando uma execução anterior do mesmo PR.

O workflow não publica o site. Ele usa `pull_request`, e não `pull_request_target`, e não recebe segredos ou credenciais de publicação. O workflow de deploy [`deploy-github-pages.yml`](../../.github/workflows/deploy-github-pages.yml) permaneceu byte a byte inalterado nesta etapa: o evento `push` em `main` continua iniciando publicação automática; `workflow_dispatch` também permanece disponível para disparo manual. O gatilho e a versão Node 24 instalados na F0.2A foram preservados.

Não existe script `test` em `package.json` nem foi localizado arquivo de suíte/configuração de testes no projeto. Nenhuma etapa de teste fictícia foi adicionada. A criação de testes fica para uma etapa apropriada.

## Governança recomendada para `main`

A F0.1 registrou ausência de proteção ativa. A consulta somente leitura ao repositório confirmou que ele é público, mas a conta conectada neste ambiente não possui permissão de administração ou escrita (`admin: false`, `push: false`). Nenhuma configuração remota foi alterada.

O proprietário, com acesso de administração, deve criar uma regra de branch ou ruleset ativo que corresponda exatamente a `main`, e então:

1. Exigir pull request antes de integrar alterações. A própria exigência de PR impede atualização direta normal da branch protegida.
2. Exigir que o check deste workflow passe antes do merge. O nome exato só poderá ser selecionado depois da primeira execução publicada; selecionar o check correspondente ao workflow “Validate pull request” e job “validate”. Habilitar atualização da branch com a base antes do merge se essa opção estiver disponível e for desejada.
3. Impedir bypass da regra: não cadastrar atores na lista de bypass do ruleset; em proteção clássica, ativar “Do not allow bypassing the above settings” para aplicar as restrições também a administradores. A conta proprietária ainda pode alterar ou remover a regra; o próprio GitHub não elimina o poder administrativo do proprietário.
4. Desabilitar force push e exclusão da `main`.
5. Manter auto-merge desativado. O proprietário deve revisar o PR e autorizar manualmente o merge somente depois que os checks obrigatórios estiverem aprovados; esse merge gerará o `push` que inicia o deploy automático.
6. Se houver outro revisor autorizado, exigir pelo menos uma aprovação e descartar aprovações obsoletas após novos commits. Para uma operação com apenas o proprietário, essa exigência pode impedir merges, pois o autor não aprova seu próprio PR; nesse caso, a decisão explícita do proprietário continua sendo o merge manual após CI aprovado.

O GitHub documenta regrasets e proteção de branches como disponíveis em repositórios públicos no plano Free; para criar ou editar essas regras é necessário acesso de administração ou permissão customizada de edição de regras. As opções de bypass têm limites próprios para administradores e planos/permissões. Se a proteção clássica não expuser controle de bypass aplicável ao proprietário, usar ruleset sem bypass actors; se a conta não conseguir editar regras, o administrador do repositório deverá fazê-lo. A regra de exigir PR e checks é o controle viável para bloquear pushes diretos ordinários, sem depender de uma restrição de atores disponível apenas em alguns tipos de conta/organização.

Referências oficiais do GitHub, consultadas em 27/10/2026:

- [Regras disponíveis em rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [Criar rulesets para um repositório](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [Sobre branches protegidas e bypass](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Gerenciar uma regra de proteção de branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)

## Validação executada

Ambiente local: Windows, Node.js `24.14.1`, npm `11.11.0`. A versão LTS maior configurada no workflow, Node `24`, corresponde ao runtime usado localmente. Os comandos foram executados neste checkout com as dependências do lockfile; a criação do workflow não alterou dependências.

| Verificação | Resultado local |
|---|---|
| `npm ci` | **Aprovado**: instalou 403 pacotes; o audit integrado reportou zero vulnerabilidades em 404 pacotes. Houve avisos de depreciação de dependências, inclusive ESLint 8 e `next lint`; não impediram as etapas. |
| `npm run typecheck` | **Aprovado** (`tsc --noEmit`). |
| `npm run lint` | **Aprovado**, sem warnings ou erros de ESLint. O Next.js avisa que `next lint` será removido no Next 16; migração de lint está fora do escopo. |
| `npm audit --omit=dev` | **Aprovado**, zero vulnerabilidades reportadas (exit code 0). |
| `npm run build` | **Aprovado** com `GITHUB_ACTIONS=true`, base path e URL configurados para GitHub Pages; exportação estática concluída. |
| Arquivos exportados | **Aprovado**: `out/index.html`, `out/404.html`, `out/manifest.webmanifest`, `out/robots.txt`, `out/sitemap.xml` e CSS existem. |
| Análise YAML | **Aprovada** por parser `js-yaml` já instalado; checagens confirmaram somente PR para `main`, Node 24, as etapas exigidas, permissões somente leitura e ausência de ações/permissões de publicação. |
| `git diff --check` | **Aprovado**, sem erro de whitespace no diff versionado. |

O Next.js local detectou um `pnpm-lock.yaml` externo em `C:\Users\Vinícius Araújo\pnpm-lock.yaml` e emitiu aviso de raiz de workspace inferida. Isso não falhou o build e o arquivo externo não foi alterado. O workflow roda em `ubuntu-latest` e instala somente a partir do `package-lock.json` do repositório; o aviso do ambiente local não prova nem antecipa o comportamento remoto.

## Vulnerabilidades, regressões e limites da evidência

Nenhuma dependência foi atualizada nesta etapa. A F0.2A documentou zero vulnerabilidades tanto no audit completo quanto no audit de produção, após atualização e instalação limpa. Nesta reprodução direcionada do novo pipeline, `npm audit --omit=dev` também retornou zero. O audit integrado à instalação `npm ci` reportou zero vulnerabilidades em 404 pacotes; não executei um `npm audit` completo separado nesta etapa para não repetir a auditoria da F0.2A. A etapa explícita de CI verifica deliberadamente a árvore de produção.

Não foram constatadas regressões nas validações executadas. A validação local reproduz os comandos e variáveis do job, mas não representa uma execução remota no GitHub Actions. A análise do arquivo YAML é estática; não comprova a resolução dos checks pelo GitHub nem permissões efetivas do runner remoto.

## Arquivos e preservação

Arquivo novo nesta etapa:

- `.github/workflows/validate-pr.yml`
- `docs/f0/F0-2B-CI-GOVERNANCA.md` (este relatório)

Continuam pendentes no working tree, preservadas desde etapas anteriores: `.github/workflows/deploy-github-pages.yml`, `app/globals.css`, `components/sections.tsx`, `package.json`, `package-lock.json` e os relatórios F0.1/F0.2A. Os hashes SHA-256 dos dois relatórios, dos dois arquivos visuais, dos manifests de dependências e do workflow de deploy foram comparados aos valores registrados no início da F0.2B e permaneceram iguais. O relatório histórico da F0.1 não foi reescrito.

## Critérios de aceite e estado do Git

| Critério | Estado |
|---|---|
| Workflow separado para PR destinado à `main` | **Aprovado localmente** |
| Node 24, instalação, typecheck, lint, audit de produção, build Pages e arquivos essenciais | **Aprovado localmente** |
| Permissão mínima e nenhum caminho de publicação no workflow de PR | **Aprovado por inspeção estática** |
| Deploy existente e seus gatilhos preservados | **Aprovado por hash**; push em `main` permanece gatilho automático |
| Proteção de branch ativa | **Pendente** de configuração pelo proprietário no GitHub |
| Check obrigatório disponível e aprovado remotamente | **Pendente** da publicação e primeira execução do workflow no GitHub |
| Aprovação explícita do proprietário para integrar/publicar | **Pendente** da governança manual descrita acima |

Branch final: `audit/f0-estabilizacao-20261027`. HEAD: `1c98a31ba79acdd157afcfb47296872bd49a9981`; referência local `main` e `origin/main` não foram alteradas. Não houve commit, push, merge, PR, alteração remota ou deploy.

**Recomendação objetiva:** aprovar os entregáveis locais da F0.2B. A aprovação não significa que a governança já esteja ativa: antes de considerar protegida a publicação, o proprietário deverá configurar a regra para `main`, publicar o workflow por um fluxo autorizado e confirmar a primeira execução e o check obrigatório no GitHub.
