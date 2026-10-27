# F0.1 — Baseline técnico

## Identificação e preservação

| Campo | Valor verificado |
|---|---|
| Repositório | `viniciusufersa/instituto-semeando-futuro` |
| Diretório | `C:\Users\Vinícius Araújo\OneDrive\Documentos\Projetos\Sites\Instituto Semeando Futuro` |
| Branch de trabalho | `audit/f0-estabilizacao-20261027` |
| Commit de baseline (HEAD) | `1c98a31ba79acdd157afcfb47296872bd49a9981` |
| `main` local e `origin/main` local | `1c98a31ba79acdd157afcfb47296872bd49a9981` |
| `origin/main` remoto consultado em 27/10/2026 | `1c98a31ba79acdd157afcfb47296872bd49a9981` |
| Data da execução | 27/10/2026 (America/Sao_Paulo) |

A branch de auditoria foi criada a partir do commit de referência. A referência local e a remota de `main` apontavam para o mesmo commit; não houve avanço em relação ao SHA informado.

Antes da auditoria, já existiam alterações não staged em `app/globals.css` e `components/sections.tsx`, relacionadas à reformulação visual da seção de propósito. Elas foram preservadas e não fazem parte deste relatório nem do commit de baseline. Os primeiros comandos foram executados nesse checkout modificado; para confirmar o comportamento do HEAD exato, instalação e build também foram executados em cópia temporária limpa extraída do SHA de referência. Nenhum arquivo de código, configuração, conteúdo institucional, dependência, lockfile ou workflow foi alterado nesta etapa. Não houve commit, push, merge ou publicação.

## Ambiente e arquitetura

- Windows, PowerShell; Node.js `v24.14.1`; npm `11.11.0`.
- CI do GitHub Actions executa em `ubuntu-latest`, seleciona Node.js `20` e usa `npm ci`.
- Next.js `15.5.7`, React e React DOM `19.1.1`, TypeScript, Tailwind CSS `4`; exportação estática configurada com `output: "export"` e `trailingSlash: true` em `next.config.ts:9-10`.
- O workflow `.github/workflows/deploy-github-pages.yml:3-7,37-46` inicia em push na `main` ou manualmente, configura `/instituto-semeando-futuro`, compila e publica `out/` no GitHub Pages.
- A consulta ao GitHub Actions encontrou como execução mais recente desse workflow na `main` o run [30838603696](https://github.com/viniciusufersa/instituto-semeando-futuro/actions/runs/30838603696), concluído com sucesso no SHA de referência em `2026-08-03T17:51:11Z`. É evidência daquela execução, não do estado operacional do Pages nesta auditoria.
- `package.json` declara 14 dependências de produção e 9 de desenvolvimento. O Next.js está fixado em `15.5.7`.
- A aplicação tem uma página de conteúdo (`app/page.tsx`) e rotas geradas para ícone, manifesto, `robots.txt`, `sitemap.xml` e página 404. O inventário de componentes inclui cabeçalho, hero, seções institucionais, carrossel de projetos, galeria, animações e rodapé. Há imagens SVG/WebP e vídeos WebM/MP4 em `public/`.
- Não foram encontrados arquivos de teste (`test`, `tests`, `__tests__`, `*.test.*` ou `*.spec.*`). Nenhum teste automatizado foi executado.
- As dependências `@react-three/drei`, `@react-three/fiber` e `three` não são órfãs: `components/hero-orbit.tsx:3-7,32-39` importa e renderiza a cena 3D.

## Comandos e resultados

| Comando / verificação | Resultado observado |
|---|---|
| `node --version` / `npm --version` | `v24.14.1` / `11.11.0` |
| `git status`, `git branch`, `git rev-parse`, `git ls-remote origin refs/heads/main` | Executados. HEAD e `main` remoto confirmados no SHA de referência. As duas alterações preexistentes foram preservadas. |
| `npm ci` | **Concluído** em Node.js 24.14.1 no checkout e em Node.js 20.20.2 numa cópia temporária limpa extraída do commit HEAD; ambos instalaram 407 pacotes e reportaram 7 vulnerabilidades (6 altas, 1 crítica). Em Node.js 20, npm `11.11.0` emitiu `EBADENGINE` para `camera-controls@3.1.2` (declara Node `>=22`), mas completou a instalação. Também houve avisos de pacotes depreciados e de segurança para Next.js `15.5.7`. |
| `npm run typecheck` | **Aprovado**: `tsc --noEmit` terminou sem erros. |
| `npm run lint` | **Aprovado com avisos**: `next lint` terminou sem avisos/erros de ESLint. O Next.js avisa que `next lint` está depreciado; também detecta `C:\Users\Vinícius Araújo\pnpm-lock.yaml` como lockfile ancestral e seleciona esse diretório como raiz do workspace, além do `package-lock.json` do projeto. |
| Build estático no checkout (Node.js 24.14.1 e 20.20.2) e build em cópia limpa do HEAD (Node.js 20.20.2), com as variáveis do workflow | **Aprovados** nos três casos: compilação, verificação de tipos, geração estática e exportação concluídas. A cópia limpa foi extraída com `git archive HEAD` para `%TEMP%\isf-f0-head-d73b03b4c9cf44c589da74173a7558cb`, então esse resultado corresponde ao commit de referência sem as duas alterações locais. A execução em cópia temporária também detectou o lockfile do diretório pai; no build limpo apareceu ainda o aviso esperado de ausência de cache. |
| `npm audit --json` | **Reprovado**: 7 grupos de pacotes vulneráveis: 6 altas e 1 crítica. Saída JSON preservada temporariamente em `%TEMP%\isf-f0-npm-audit.json`; não versionada. |
| `npm audit --omit=dev --json` | **Reprovado**: 5 grupos em dependências incluídas na árvore de produção: 4 altas e 1 crítica. Saída JSON preservada temporariamente em `%TEMP%\isf-f0-npm-audit-prod.json`; não versionada. |
| Verificação do export `out/` | **Aprovada parcialmente**: HTML principal, 404, manifesto, robots, sitemap, CSS e chunks foram gerados. 55 referências locais encontradas no HTML apontam para recursos existentes no export. |
| Proteção de branch no GitHub | **Não verificada**: a API REST de proteção retornou HTTP 401 sem autorização para esse endpoint. A informação preliminar de ausência de proteção não foi confirmada nesta execução. |
| Testes automatizados e QA visual/acessível em navegador | **Não executados**: não foram encontrados testes no repositório; a F0.1 foi limitada ao baseline técnico e à inspeção estática. |

## Auditoria de dependências

Resumo de `npm audit` na data da execução: 7 grupos de pacotes, com 6 altas e 1 crítica. A execução com `--omit=dev` reteve 5 grupos (4 altas e 1 crítica), portanto 2 grupos são exclusivos da árvore de desenvolvimento. A severidade e as contagens refletem o feed de advisories obtido pelo npm em 27/10/2026; não representam, por si só, explorabilidade no site exportado.

| Pacote instalado | Severidade agregada | Classificação observada | Referências de advisory |
|---|---:|---|---|
| `brace-expansion` `1.1.18` e `5.0.9` | Alta | Desenvolvimento (caminhos via ESLint/parser; ausente com `--omit=dev`) | [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7), [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) |
| `js-yaml` `4.3.1` | Alta | Desenvolvimento (ESLint; ausente com `--omit=dev`) | [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh) |
| `nanoid` `3.3.16` | Alta | Transitiva, presente na auditoria de produção | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) |
| `next` `15.5.7` | Crítica | Dependência direta de produção; múltiplos advisories, incluindo itens de servidor, imagem, cache e denial of service | 34 referências retornadas pelo audit: [GHSA-w37m-7fhw-fmv9](https://github.com/advisories/GHSA-w37m-7fhw-fmv9), [GHSA-mwv6-3258-q52c](https://github.com/advisories/GHSA-mwv6-3258-q52c), [GHSA-9g9p-9gw9-jx7f](https://github.com/advisories/GHSA-9g9p-9gw9-jx7f), [GHSA-h25m-26qc-wcjf](https://github.com/advisories/GHSA-h25m-26qc-wcjf), [GHSA-ggv3-7p47-pfv8](https://github.com/advisories/GHSA-ggv3-7p47-pfv8), [GHSA-3x4c-7xq6-9pq8](https://github.com/advisories/GHSA-3x4c-7xq6-9pq8), [GHSA-q4gf-8mx6-v5v3](https://github.com/advisories/GHSA-q4gf-8mx6-v5v3), [GHSA-8h8q-6873-q5fj](https://github.com/advisories/GHSA-8h8q-6873-q5fj), [GHSA-26hh-7cqf-hhc6](https://github.com/advisories/GHSA-26hh-7cqf-hhc6), [GHSA-3g8h-86w9-wvmq](https://github.com/advisories/GHSA-3g8h-86w9-wvmq), [GHSA-ffhc-5mcf-pf4q](https://github.com/advisories/GHSA-ffhc-5mcf-pf4q), [GHSA-vfv6-92ff-j949](https://github.com/advisories/GHSA-vfv6-92ff-j949), [GHSA-gx5p-jg67-6x7h](https://github.com/advisories/GHSA-gx5p-jg67-6x7h), [GHSA-mg66-mrh9-m8jx](https://github.com/advisories/GHSA-mg66-mrh9-m8jx), [GHSA-h64f-5h5j-jqjh](https://github.com/advisories/GHSA-h64f-5h5j-jqjh), [GHSA-c4j6-fc7j-m34r](https://github.com/advisories/GHSA-c4j6-fc7j-m34r), [GHSA-492v-c6pp-mqqv](https://github.com/advisories/GHSA-492v-c6pp-mqqv), [GHSA-wfc6-r584-vfw7](https://github.com/advisories/GHSA-wfc6-r584-vfw7), [GHSA-267c-6grr-h53f](https://github.com/advisories/GHSA-267c-6grr-h53f), [GHSA-36qx-fr4f-26g5](https://github.com/advisories/GHSA-36qx-fr4f-26g5), [GHSA-m99w-x7hq-7vfj](https://github.com/advisories/GHSA-m99w-x7hq-7vfj), [GHSA-89xv-2m56-2m9x](https://github.com/advisories/GHSA-89xv-2m56-2m9x), [GHSA-68g3-v927-f742](https://github.com/advisories/GHSA-68g3-v927-f742), [GHSA-4633-3j49-mh5q](https://github.com/advisories/GHSA-4633-3j49-mh5q), [GHSA-4c39-4ccg-62r3](https://github.com/advisories/GHSA-4c39-4ccg-62r3), [GHSA-p9j2-gv94-2wf4](https://github.com/advisories/GHSA-p9j2-gv94-2wf4), [GHSA-q8wf-6r8g-63ch](https://github.com/advisories/GHSA-q8wf-6r8g-63ch), [GHSA-955p-x3mx-jcvp](https://github.com/advisories/GHSA-955p-x3mx-jcvp), [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36), [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4), [GHSA-4jqv-mc3x-m676](https://github.com/advisories/GHSA-4jqv-mc3x-m676), [GHSA-mcj8-r9mp-w47p](https://github.com/advisories/GHSA-mcj8-r9mp-w47p), [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw), [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r) |
| `postcss` `8.4.31` (cópia sob `next`) | Alta | Transitiva de dependência de produção; a cópia `8.5.25` sob Tailwind não aparece vulnerável no audit | [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93), [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q), [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) |
| `sharp` `0.34.5` | Alta | Dependência transitiva opcional de `next`, presente no audit de produção; build estático usa Next no build | [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) |
| `source-map-js` `1.2.1` | Alta | Transitiva, presente no audit de produção | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) |

O npm indicou disponibilidade de correção para Next.js `15.5.28` em seu resultado, mas nenhuma correção foi aplicada. O site configura exportação estática e o artefato não inclui servidor Next em execução; por isso os advisories próprios de servidor não devem ser tratados automaticamente como exploração confirmada na hospedagem estática. As dependências ainda participam do build e a conclusão sobre exposição deve ser feita advisory por advisory, considerando os componentes efetivamente publicados. Não foi identificada vulnerabilidade explorada ou incidente.

## Exportação estática e problemas confirmados

1. **URL canônica e Open Graph duplicam o caminho do projeto.** O workflow define `NEXT_PUBLIC_SITE_URL` já com `/instituto-semeando-futuro` (`.github/workflows/deploy-github-pages.yml:40`); o `basePath` usa o mesmo prefixo (`next.config.ts:4-12`); `app/layout.tsx:23,27` fornece `getPublicAssetPath("/")` aos campos canonical e Open Graph. No `out/index.html` produzido nesta execução, ambos foram exportados como `https://viniciusufersa.github.io/instituto-semeando-futuro/instituto-semeando-futuro/`. A URL duplica o subcaminho e precisa ser corrigida em fase posterior.
2. **Requisito de Node.js divergente do runtime do workflow.** O workflow seleciona Node.js 20 (`.github/workflows/deploy-github-pages.yml:25-28`), enquanto a versão travada de `camera-controls` declara `node >=22.0.0` (`package-lock.json:2643-2660`), introduzida por `@react-three/drei`. Em Node.js `20.20.2`, `npm ci` completou, mas emitiu `EBADENGINE`; o build estático também completou nesse runtime. Portanto, a divergência declarada está confirmada, mas não foi reproduzida falha de instalação ou build com a configuração atual do npm. O workflow não foi executado no GitHub nesta etapa.
3. **Ferramenta de lint depreciada e raiz inferida fora do projeto.** O script `lint` em `package.json` usa `next lint`. Ele ainda terminou com sucesso, mas Next.js informa que será removido no Next 16. A detecção automática também selecionou o lockfile `C:\Users\Vinícius Araújo\pnpm-lock.yaml` do diretório pai. É um aviso do ambiente local; não foi verificado se o runner GitHub Actions tem o mesmo lockfile ancestral.
4. **Compatibilidade de movimento reduzido requer revisão.** Há suporte CSS em `app/globals.css:627`, tratamento em `components/experience.tsx:14-16` e `components/reveal.tsx:6-14`. No componente 3D, a rotação e o `Float` respeitam `useReducedMotion`, mas `MeshDistortMaterial` mantém `speed={1.2}` (`components/hero-orbit.tsx:11-24`). A extensão do movimento perceptível não foi avaliada visualmente nesta fase.
5. **Risco de custo de mídia da galeria a avaliar.** `components/sections/gallery-section.tsx:10-14,52-65` repete os itens três vezes e configura vídeo `autoPlay`, `loop` e `preload="metadata"`. O impacto em rede, memória e bateria não foi medido; registrar como candidato para análise de desempenho, não como falha quantificada.

O HTML exportado contém caminhos de recursos sob `/instituto-semeando-futuro/`; as 55 referências locais verificadas estavam presentes em `out/`. O sitemap e robots foram gerados. A inconsistência confirmada está nos campos canonical/Open Graph, não na existência dos arquivos exportados.

## Riscos ainda não confirmados e verificações ausentes

- Não foi possível consultar proteção/regras da branch no GitHub: o endpoint de proteção respondeu HTTP 401. A alegação preliminar de branch sem proteção permanece não verificada.
- `npm ci` e build estático passaram em Node.js `20.20.2` local, com aviso `EBADENGINE` na instalação; o workflow do GitHub não foi reexecutado nesta etapa, portanto seu resultado remoto atual permanece não verificado.
- Não foi executada análise visual em navegador, auditoria manual de acessibilidade, medição de performance, teste em dispositivos, nem validação de conteúdo institucional. Não declarar esses itens aprovados.
- Não há inventário de testes automatizados no checkout. A ausência dos arquivos foi verificada; nenhuma suíte foi executada.
- Não foram conferidas permissões de imagem/vídeo, validade factual de números, contatos, objetivos ou afirmações institucionais. Esses itens permanecem para validação documental nas fases F1–F5.
- A análise de advisories identifica versões afetadas segundo o npm; aplicabilidade de falhas específicas do runtime Next em um site publicado como arquivos estáticos não foi demonstrada.

## Pendências propostas para F0.2–F0.5

| Fase | Pendência diagnóstica/objetivo sugerido |
|---|---|
| F0.2 | Resolver a divergência de engine Node.js e os advisories de dependências em escopo controlado; após a decisão, validar `npm ci`, typecheck, lint e build no runtime escolhido para o CI. |
| F0.3 | Corrigir e validar canonical/Open Graph sob o subcaminho real do GitHub Pages; verificar manifesto, sitemap, robots e navegação com basePath. |
| F0.4 | Fazer QA de acessibilidade e movimento reduzido no navegador; avaliar teclado, foco, contraste, autoplay e comportamento responsivo da galeria. |
| F0.5 | Medir tamanho do export, JavaScript inicial, mídia e carregamento; priorizar ajustes com medições reproduzíveis, sem presumir ganhos. |

Esta distribuição é recomendação técnica para organizar trabalho futuro, não afirmação de que a numeração formal das fases já foi aprovada.

## Conteúdo institucional reservado a F1–F5

Validar com fontes oficiais do Instituto as descrições de missão, visão e valores, ações/projetos, números e resultados, localização, contatos, destinos de apoio e autorização/adequação das imagens e vídeos. A auditoria F0.1 não altera nem confirma esses dados.

## Critérios objetivos de aceite da F0.1

- Repositório, branch, HEAD, referências local/remota de `main` e alterações preexistentes identificados e preservados.
- Ambiente e comandos previstos executados quando disponíveis; sucesso, falha e não execução registrados sem converter avisos em aprovação.
- Árvore de dependências auditada com distinção de produção/desenvolvimento, versões instaladas e links de advisories.
- Export estático inspecionado, rotas e recursos essenciais conferidos e problemas confirmados anotados com caminho/linha.
- Testes, QA visual, proteção de branch e questões institucionais não verificadas explicitamente marcadas como pendentes.
- Somente `docs/f0/BASELINE-TECNICO.md` criado como arquivo versionável nesta etapa; sem correção de código/dependência/infraestrutura.

## Recomendação de aceite da F0.1

**Reprovada para aceite integral no momento.** O baseline foi produzido e as verificações foram executadas, mas a etapa revelou um `canonical`/Open Graph inválido no caminho de publicação, vulnerabilidades pendentes na árvore de dependências e incompatibilidade declarada entre uma dependência e o Node.js do CI. Além disso, proteção de branch e QA visual não puderam ser confirmados. A reprovação é da condição técnica de baseline/aceite, não uma afirmação de incidente ou de falha do build local: typecheck, lint e exportação passaram no ambiente registrado.

**Próxima mudança coesa recomendada:** após avaliação deste relatório, F0.2 deve alinhar a exigência de engine da árvore de dependências à versão Node.js do workflow e tratar os advisories, com nova validação completa de CI. O build local no Node 20 passou, mas `npm ci` reporta `EBADENGINE`; a correção de metadados de URL pode ser isolada em F0.3.

