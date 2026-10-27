# F0.2A — Segurança de Dependências e Compatibilidade de Runtime

**Data:** 27/10/2026
**Branch:** `audit/f0-estabilizacao-20261027`
**Commit-base:** `1c98a31ba79acdd157afcfb47296872bd49a9981`
**Baseline histórico:** [`BASELINE-TECNICO.md`](BASELINE-TECNICO.md)

## Resultado

**Recomendação: aprovar a F0.2A.** O Next.js permaneceu na linha 15, a instalação foi reproduzida no Node.js 24 LTS, o build estático passou com as variáveis do GitHub Pages e `npm audit` e `npm audit --omit=dev` terminaram com zero vulnerabilidades reportadas.

## Arquivos alterados

| Arquivo | Alteração e justificativa |
|---|---|
| `package.json` | Next.js atualizado de `15.5.7` para `15.5.28`; `eslint-config-next` pareado atualizado de `15.5.7` para `15.5.28`. Adicionado override restrito ao pacote transitivo `postcss` na versão corrigida `8.5.25`. React, React DOM e TypeScript foram mantidos. |
| `package-lock.json` | Atualizados Next.js, ESLint config e transitivos afetados, mantendo as versões principais existentes. |
| `.github/workflows/deploy-github-pages.yml` | Runtime do workflow atualizado de Node.js `20` para `24`, linha LTS suportada e compatível com `camera-controls`. |
| `docs/f0/F0-2A-DEPENDENCIAS.md` | Relatório desta etapa. |

As alterações preexistentes em `app/globals.css` e `components/sections.tsx` foram preservadas sem modificação. `docs/f0/BASELINE-TECNICO.md` também permaneceu byte a byte inalterado; SHA-256 conferido: `20244C808144DDB1554251A7DE06E3D9B3B6A9CFBAF76B56C4A7722FB2489D9E`.

## Decisões técnicas

### Next.js e compatibilidade

`next@15.5.28` é uma atualização corretiva dentro da linha 15 recomendada pelo audit do npm. Os peers verificados de Next aceitam React e React DOM 19; os de `eslint-config-next@15.5.28` aceitam ESLint 8 e TypeScript 5.9.3. A árvore efetivamente instalada manteve React/React DOM `19.1.1`, ESLint `8.57.1` e TypeScript `5.9.3`; typecheck, lint e build foram executados após a atualização.

O `npm audit fix` sem `--force` atualizou as dependências transitivas com correções dentro do escopo atual. Next.js 15.5.28 ainda fixa PostCSS 8.4.31 em seu pacote. A auditoria identificou que a cópia vulnerável do PostCSS é o único caminho residual após o bump do Next. Para não migrar para Next 16, o projeto força PostCSS `8.5.25`, versão corrigida já utilizada pela árvore Tailwind. A decisão segue o padrão de override documentado pelo npm e o aviso upstream sobre a linha Next 15, que recomenda PostCSS `>=8.5.23`. O build e a instalação limpa confirmaram a combinação.

O GitHub Actions agora usa `node-version: 24`. Na data do trabalho, Node.js 24 era LTS; Node.js 20 estava EOL desde 24/03/2026. O pacote travado `camera-controls@3.1.2`, dependência de `@react-three/drei@10.7.7`, declara Node `>=22.0.0`. `@react-three/drei`, `@react-three/fiber` e `three` continuam instalados porque `components/hero-orbit.tsx` efetivamente os usa. Node `24.22.1` e npm `11.11.0` foram usados na instalação e nas verificações finais; não houve aviso `EBADENGINE`.

Referências consultadas:

- [Node.js Releases — status LTS/EOL](https://nodejs.org/en/about/previous-releases)
- [Node.js 24.22.1 — security release LTS](https://nodejs.org/en/blog/release/v24.22.1)
- [Next.js 15.5.28 no npm](https://www.npmjs.com/package/next/v/15.5.28)
- [Next.js security advisories](https://github.com/vercel/next.js/security/advisories)
- [Issue upstream sobre PostCSS/Sharp na linha Next 15](https://github.com/vercel/next.js/issues/97011)
- [npm — overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides)
- [camera-controls 3.1.2 no npm](https://www.npmjs.com/package/camera-controls/v/3.1.2)

### Versões e avisos tratados

| Dependência | Antes | Depois | Situação |
|---|---:|---:|---|
| `next` | `15.5.7` | `15.5.28` | Advisory crítico e advisories altos da linha corrigidos; nenhum advisory restante reportado pelo audit após a atualização dos transitivos. |
| `eslint-config-next` | `15.5.7` | `15.5.28` | Mantido pareado à versão do framework; peers continuam compatíveis com ESLint 8 e TypeScript instalado. |
| `postcss` sob Next | `8.4.31` | `8.5.25` | Corrigidos os quatro avisos de PostCSS; a cópia do Next foi deduplicada com a versão corrigida presente na árvore. |
| `sharp` | `0.34.5` | `0.35.5` | Corrigidos os advisories transitivos de bibliotecas nativas/libvips/libheif; build estático validado. |
| `nanoid` | `3.3.16` | `3.3.20` | Corrigido o aviso de gerador com tamanho zero. |
| `brace-expansion` | `1.1.18`, `5.0.9` | `1.1.21`, `5.0.12` | Corrigidos os avisos de expansão/recursão, em dependências transitivas de desenvolvimento. |
| `js-yaml` | `4.3.1` | `4.3.2` | Corrigido o aviso de consumo de CPU em merge keys, em dependência de desenvolvimento. |
| `source-map-js` | `1.2.1` | `1.2.2` | Corrigido o aviso de DoS via offsets de source map. |
| `camera-controls` | `3.1.2` | `3.1.2` | Sem vulnerabilidade reportada; seu requisito Node `>=22` é satisfeito pelo Node 24 do workflow. |

Advisories observados na auditoria inicial: `next` ([lista oficial de advisories Next.js](https://github.com/vercel/next.js/security/advisories); exemplos críticos/altos: [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw), [GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr), [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r)); PostCSS: [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93), [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q), [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849); Sharp: [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w); nanoid: [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8); brace-expansion: [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7), [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p); js-yaml: [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh); source-map-js: [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). A lista completa dos advisories Next.js observados na F0.1 está preservada em [`BASELINE-TECNICO.md`](BASELINE-TECNICO.md).

## Comparação do audit

| Momento | `npm audit` | `npm audit --omit=dev` |
|---|---:|---:|
| Baseline F0.1 | 7 grupos: 6 altas, 1 crítica | 5 grupos: 4 altas, 1 crítica |
| Antes desta correção, audit atual | 7 grupos: 6 altas, 1 crítica | 5 grupos: 4 altas, 1 crítica |
| Após Next.js 15.5.28, antes dos transitivos/override | 7 grupos: 6 altas, 1 moderada, 0 críticas | ainda havia alertas transitivos de produção |
| Estado final após atualização do lockfile e instalação limpa | **0** | **0** |

Os totais são grupos de pacotes na resposta do npm. O resultado final foi executado após `npm ci`; as duas auditorias retornaram exit code 0 e contagem de `info`, `low`, `moderate`, `high` e `critical` igual a zero.

## Aplicabilidade à publicação estática

O projeto publica apenas o diretório exportado de uma aplicação `output: "export"`; não há processo Next.js de servidor na hospedagem GitHub Pages. Por isso, advisories de Server Actions, RSC, rewrites, cache do servidor ou endpoint de otimização de imagens não demonstravam, por si só, exploração na publicação estática. O projeto também configura `images.unoptimized: true`. Ainda assim, corrigir a versão do Next reduz exposição caso o projeto seja servido por um runtime Next no futuro e remove as ocorrências do grafo auditado.

PostCSS, ESLint, source maps e Sharp são dependências da etapa de build/tooling, não scripts cliente adicionados à página. A auditoria zero é o resultado atual do banco npm para a árvore travada; não substitui avaliação de advisories futuros nem afirma que houve exploração anterior. Nenhum incidente foi identificado.

## Validação executada

Ambiente final: Windows, Node.js `24.22.1` (LTS), npm `11.11.0`.

| Comando / verificação | Resultado |
|---|---|
| `npm ci` | **Aprovado**: 403 pacotes adicionados, audit embutido sem vulnerabilidades; sem `EBADENGINE`. Avisos de depreciação de `inflight`, `rimraf`, `glob`, `eslint@8.57.1` e `next lint` permanecem. |
| `npm run typecheck` | **Aprovado** (`tsc --noEmit`). |
| `npm run lint` | **Aprovado**: sem warnings/erros de ESLint. Next.js ainda avisa que `next lint` será removido no Next 16. |
| Build de produção com `GITHUB_ACTIONS=true`, `NEXT_PUBLIC_BASE_PATH=/instituto-semeando-futuro` e `NEXT_PUBLIC_SITE_URL=https://viniciusufersa.github.io/instituto-semeando-futuro` | **Aprovado** no Node 24.22.1, Next.js 15.5.28; geração estática e exportação concluídas. |
| `npm audit --json` | **Aprovado**: 0 vulnerabilidades. |
| `npm audit --omit=dev --json` | **Aprovado**: 0 vulnerabilidades. |
| Artefatos essenciais | **Aprovado**: `out/index.html`, `out/404.html`, `out/manifest.webmanifest`, `out/robots.txt`, `out/sitemap.xml` e CSS em `out/_next/static/css/` existem. |
| `git diff --check` | **Aprovado**, sem erros de whitespace no diff versionado. |

O aviso Next sobre a raiz do workspace inferida a partir de `C:\Users\Vinícius Araújo\pnpm-lock.yaml` permanece no ambiente local e também apareceu no build F0.1; não foi introduzido por esta alteração. `next lint` segue funcional, mas depreciado desde Next.js 15.5. Ambos ficam como manutenção posterior, fora da correção de segurança/runtime.

## Regressões, bloqueios e itens não alterados

- Não houve falha de instalação, TypeScript, lint ou build.
- O problema canonical/Open Graph duplicado da F0.1 permanece intocado, conforme os limites da F0.2A.
- Não foram alterados galeria, navegação, acessibilidade, animações, conteúdo, estatísticas, páginas, integração, permissões do GitHub ou publicação.
- A validação de build foi executada no checkout de trabalho e, portanto, incluiu as duas alterações visuais preexistentes; ambas foram preservadas byte a byte pelo trabalho de dependências.
- O relatório histórico `docs/f0/BASELINE-TECNICO.md` não foi editado.
- O GitHub Actions remoto não foi disparado; o CI foi reproduzido localmente com as mesmas variáveis de export e Node.js 24.22.1.

## Estado do Git e critérios de aceite

Branch permanece `audit/f0-estabilizacao-20261027`, HEAD permanece `1c98a31ba79acdd157afcfb47296872bd49a9981`. Os arquivos versionados alterados para F0.2A são `package.json`, `package-lock.json` e `.github/workflows/deploy-github-pages.yml`; o novo relatório é `docs/f0/F0-2A-DEPENDENCIAS.md`. Permanecem as alterações locais preexistentes em `app/globals.css` e `components/sections.tsx`. Não houve commit, push, merge, deploy nem alteração da referência `main`.

Critérios verificados: advisories do npm reduzidos a zero na árvore completa e na de produção; runtime do CI atualizado para LTS compatível com `camera-controls`; instalação limpa sem `EBADENGINE`; peers de Next/ESLint alinhados; typecheck, lint, exportação Pages e arquivos essenciais aprovados; alterações preexistentes e relatório F0.1 preservados.

**Recomendação de aprovação: aprovar F0.2A.** Não iniciar F0.2B nesta etapa. O `canonical`/Open Graph incorreto continua reservado à fase posterior indicada no baseline.

