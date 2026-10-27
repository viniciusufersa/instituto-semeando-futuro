# F0.3 — Estabilização Funcional: canonical e Open Graph

**Data:** 27/10/2026  
**Branch:** `audit/f0-estabilizacao-20261027`  
**HEAD de referência:** `1c98a31ba79acdd157afcfb47296872bd49a9981`  
**Relatórios consultados:** [`BASELINE-TECNICO.md`](BASELINE-TECNICO.md), [`F0-2A-DEPENDENCIAS.md`](F0-2A-DEPENDENCIAS.md), [`F0-2B-CI-GOVERNANCA.md`](F0-2B-CI-GOVERNANCA.md)

## Resultado

**Recomendação: aceitar esta intervenção da F0.3.** A duplicação foi reproduzida no HTML exportado antes da mudança. Após a correção, dois builds estáticos foram gerados e inspecionados: com o subcaminho do GitHub Pages e sem `basePath`. Canonical, Open Graph, sitemap, robots, manifest e referências locais essenciais apresentaram os valores esperados nos dois cenários.

## Investigação e causa-raiz

Antes da correção, as variáveis de Pages eram:

- `NEXT_PUBLIC_SITE_URL=https://viniciusufersa.github.io/instituto-semeando-futuro` (domínio e subcaminho do repositório).
- `NEXT_PUBLIC_BASE_PATH=/instituto-semeando-futuro`.
- No Actions, `GITHUB_ACTIONS=true` ativa o mesmo `basePath` constante em `next.config.ts`; `assetPrefix` recebe esse valor também.

`app/layout.tsx` usava a URL completa de `NEXT_PUBLIC_SITE_URL` como `metadataBase` e, ao mesmo tempo, enviava `getPublicAssetPath("/")` a `alternates.canonical` e `openGraph.url`. O helper prefixa caminhos locais com `NEXT_PUBLIC_BASE_PATH`. Assim, o Next.js combinava o pathname do `metadataBase` (já `/instituto-semeando-futuro`) com o valor relativo gerado pelo helper (também `/instituto-semeando-futuro/`).

A inspeção de `out/index.html` antes da alteração confirmou a causa e a URL inválida:

```text
canonical: https://viniciusufersa.github.io/instituto-semeando-futuro/instituto-semeando-futuro/
og:url:    https://viniciusufersa.github.io/instituto-semeando-futuro/instituto-semeando-futuro/
```

## Correção aplicada

Em `app/layout.tsx`, `NEXT_PUBLIC_SITE_URL` agora é interpretada como URL, e `metadataBase` é construído apenas com sua origem (`siteUrl.origin`). Os campos canonical e Open Graph continuam usando `getPublicAssetPath("/")`, que permanece responsável por acrescentar o caminho local configurado uma única vez. Nenhum helper, dependência, configuração de build, conteúdo, sitemap, robots ou manifest foi modificado.

| Cenário | Antes | Depois |
|---|---|---|
| GitHub Pages — canonical | `https://viniciusufersa.github.io/instituto-semeando-futuro/instituto-semeando-futuro/` | `https://viniciusufersa.github.io/instituto-semeando-futuro/` |
| GitHub Pages — `og:url` | `https://viniciusufersa.github.io/instituto-semeando-futuro/instituto-semeando-futuro/` | `https://viniciusufersa.github.io/instituto-semeando-futuro/` |
| Sem `basePath` — canonical | Não duplicava no defeito reportado; cenário incluído como regressão | `https://semeandoofuturo.org/` |
| Sem `basePath` — `og:url` | Não duplicava no defeito reportado; cenário incluído como regressão | `https://semeandoofuturo.org/` |

O caminho do Pages aparece exatamente uma vez em cada URL corrigida. Sitemap e robots continuam usando a URL completa configurada em `NEXT_PUBLIC_SITE_URL`; manifest continua obtendo seus caminhos pelo helper. Isso preserva os valores atuais e evita que a correção de metadata altere esses artefatos.

## Arquivos

- **Modificado:** `app/layout.tsx` — `metadataBase` passa a apontar para a origem para não repetir o subcaminho já aplicado pelo helper.
- **Criado:** `docs/f0/F0-3-ESTABILIZACAO.md` — este relatório.

Não houve alteração de identidade visual, navegação, galeria, animações, dependências ou informação institucional.

## Comandos e evidências

Ambiente: Windows, Node.js `v24.14.1`, npm `11.11.0`, Next.js `15.5.28`.

| Verificação | Resultado observado |
|---|---|
| Inspeção anterior de `out/index.html` | **Defeito reproduzido**: canonical e `og:url` continham o subcaminho duas vezes, conforme acima. |
| `npm run typecheck` | **Aprovado** (`tsc --noEmit`). |
| `npm run lint` | **Aprovado**, sem warnings ou erros de ESLint. O Next.js emitiu aviso de depreciação de `next lint`. |
| `GITHUB_ACTIONS=true`, `NEXT_PUBLIC_BASE_PATH=/instituto-semeando-futuro`, `NEXT_PUBLIC_SITE_URL=https://viniciusufersa.github.io/instituto-semeando-futuro`; `npm run build` | **Aprovado**; exportação estática de produção concluída. |
| Inspeção da exportação Pages | **Aprovada por script temporário com `node:assert/strict`**: canonical e `og:url` exatamente `https://viniciusufersa.github.io/instituto-semeando-futuro/`; exatamente uma ocorrência do subcaminho em cada. |
| Caminhos locais na exportação Pages | **Aprovados**: 56 referências `src`, `href` e `poster` de tags de recurso resolvidas a arquivos existentes em `out/`. `out/index.html`, `out/404.html`, manifest, robots, sitemap e ícone também existem. |
| Sitemap Pages | **Aprovado**: contém `https://viniciusufersa.github.io/instituto-semeando-futuro`. |
| Robots Pages | **Aprovado**: aponta para `https://viniciusufersa.github.io/instituto-semeando-futuro/sitemap.xml`. |
| Manifest Pages | **Aprovado**: `start_url` é `/instituto-semeando-futuro/`; ícone é `/instituto-semeando-futuro/icon.svg` e o arquivo `out/icon.svg` existe. |
| Build sem `basePath` nem URL sobrescrita; `npm run build` | **Aprovado**; exportação estática concluída usando o domínio padrão. |
| Inspeção sem `basePath` | **Aprovada pelo mesmo teste de regressão**: canonical e `og:url` iguais a `https://semeandoofuturo.org/`; 56 referências locais existentes; sitemap contém o domínio raiz; robots aponta a `https://semeandoofuturo.org/sitemap.xml`; manifest aponta a `/` e `/icon.svg`. |

Os testes de regressão foram executados diretamente com o módulo nativo `node:assert/strict` em comandos temporários; nenhum framework ou arquivo de teste foi adicionado, pois o projeto não possui suíte configurada. Os scripts inspecionaram o HTML e arquivos efetivamente gerados nos dois builds, não apenas o código-fonte.

O ESLint e ambos os builds repetiram o aviso local já observado: Next.js inferiu a raiz do workspace a partir de `C:\Users\Vinícius Araújo\pnpm-lock.yaml`, fora do repositório. `next lint` também permanece depreciado. Esses avisos não impediram as verificações e não foram alterados por esta intervenção.

## Riscos e limitações restantes

- Os builds e inspeções foram locais; não houve execução de workflow no GitHub nem publicação, conforme o escopo.
- `NEXT_PUBLIC_BASE_PATH` e o pathname de `NEXT_PUBLIC_SITE_URL` devem continuar representando o mesmo subcaminho no ambiente de Pages. Esta correção usa a origem para metadata e deixa o caminho ao helper; sitemap e robots ainda usam a URL completa.
- A validação sem `basePath` usou o domínio padrão `https://semeandoofuturo.org`; não foi exercido um domínio customizado configurado com subcaminho diferente.
- Avisos de depreciação do lint e detecção de lockfile ancestral permanecem para etapas próprias.

## Estado final do Git e aceite

Branch: `audit/f0-estabilizacao-20261027`. HEAD permaneceu `1c98a31ba79acdd157afcfb47296872bd49a9981`. As alterações locais anteriores da F0.2A/F0.2B e os diffs preexistentes de `app/globals.css` e `components/sections.tsx` foram preservados. Os relatórios F0.1, F0.2A e F0.2B foram lidos e não editados. `git diff --check` passou. Não houve commit, push, merge, operação remota ou deployment.

Critérios desta intervenção: causa comprovada no HTML anterior; duplicação corrigida; caminho Pages presente uma única vez; caso sem `basePath` aprovado; exportação, metadata e recursos essenciais conferidos; sitemap, robots e manifest sem regressões observadas; arquivos e conteúdo fora do escopo preservados.

**Recomendação objetiva: aceitar a primeira intervenção da F0.3.** A aceitação cobre apenas a correção e validação de canonical/Open Graph descritas aqui. Acessibilidade e as demais pendências da F0.3 não foram iniciadas.

## F0.3 — Acessibilidade e Estabilização Funcional

### Problemas confirmados

- A galeria renderizava três cópias dos mesmos itens na árvore acessível, descrevia o arraste como único método de navegação e não tinha controles por teclado.
- O menu móvel não tratava Escape, não declarava a relação `aria-controls`, tinha o botão de alternância depois dos links na ordem do DOM e não definia foco ao fechar ou cruzar o breakpoint móvel/desktop. O header também podia ficar invisível enquanto continha o foco.
- O vídeo do Hero continuava sendo atualizado pela rolagem mesmo com `prefers-reduced-motion: reduce`. Vídeos da galeria tinham `autoPlay` incondicional; o ajuste do túnel da galeria também continuava alterando transformações.
- O Lenis e as animações GSAP só consultavam movimento reduzido na montagem; a barra de progresso usava `useSpring` mesmo nesse modo; o botão “Voltar ao topo” sempre solicitava rolagem suave e podia perder o foco quando desaparecia.
- Os seis cartões ODS eram artigos informativos com `tabIndex={0}`, sem ação associada.
- O link visual “Clique aqui” apontava para WhatsApp e não tinha nome acessível que descrevesse seu destino.

### Correções implementadas

| Arquivo | Alteração |
|---|---|
| `components/sections/gallery-section.tsx` | Mantido o Embla existente; adicionados botões anterior/próximo com nomes acessíveis, `aria-controls`, grupo de controles e anúncio `aria-live` do item atual. As cópias visuais repetidas são `aria-hidden` e `inert`; somente um conjunto de 10 slides fica na árvore acessível. A descrição da imagem não é repetida em uma segunda legenda; vídeos mantêm a descrição textual. A ativação por botão também impede que o carregamento posterior de mídia reposicione o carrossel. |
| `components/sections/gallery-section.tsx` | A reprodução dos vídeos agora é controlada por `matchMedia`: continua no modo padrão e pausa ao ativar movimento reduzido, inclusive se a preferência mudar durante a sessão. No modo reduzido, o túnel JS é suspenso, os cartões ficam estáticos e os controles do Embla saltam sem animação. |
| `components/site-header.tsx` | Botão movido para antes do `<nav>` na ordem do DOM, relação `aria-controls` adicionada, Escape fecha e devolve foco ao botão, links fecham o menu e devolvem o foco ao controle, e mudança para desktop fecha o estado móvel sem manter foco no botão que ficará oculto. O header aguarda o foco sair antes de se esconder. A navegação continua sendo um menu de links não modal, sem armadilha de foco. |
| `components/hero.tsx` | A rolagem deixa de controlar o vídeo do Hero sob movimento reduzido, inclusive quando a preferência muda durante a sessão. O título principal aceita foco programático para receber o foco após “Voltar ao topo”. |
| `components/experience.tsx` | Lenis e a animação GSAP são iniciados/destruídos conforme mudanças de `prefers-reduced-motion`; o progresso de rolagem usa o valor sem spring no modo reduzido; “Voltar ao topo” usa rolagem automática nesse modo e move o foco ao título do Hero antes de o botão desaparecer. |
| `components/sections.tsx` | Removido `tabIndex={0}` dos artigos ODS sem ação; removidos apenas os estilos de foco correspondentes. Os cartões seguem informativos e não viraram links fictícios. |
| `components/site-footer.tsx` | Link para WhatsApp recebeu `aria-label` descritivo; o ícone foi marcado como decorativo. O texto visual “Clique aqui” e o destino permaneceram. |
| `app/page.tsx` | O alvo do link “Pular para o conteúdo principal” recebeu `tabIndex={-1}` para poder receber foco sem entrar na sequência de Tab. |
| `app/globals.css` | Adicionados estilos dos dois controles da galeria, usando o foco global já existente; removidas somente as regras `:focus-visible` dos cartões ODS que deixaram de ser focáveis; no modo reduzido, removidos transformações e `will-change` do túnel. As alterações visuais preexistentes foram mantidas. |

Não foram alterados `app/layout.tsx`, dependências, lockfile, workflows, dados institucionais, estrutura das páginas, navegação existente ou os relatórios históricos anteriores. A correção canonical/OG da seção anterior não foi reaberta; ela também passou na inspeção do export desta etapa.

### Verificações e evidências

Ambiente de build: Windows, Node.js `v24.14.1`, npm `11.11.0`, Next.js `15.5.28`. A exportação Pages usou `GITHUB_ACTIONS=true`, `NEXT_PUBLIC_BASE_PATH=/instituto-semeando-futuro` e `NEXT_PUBLIC_SITE_URL=https://viniciusufersa.github.io/instituto-semeando-futuro`.

| Verificação | Resultado |
|---|---|
| `npm run typecheck` | **Aprovado** (`tsc --noEmit`). |
| `npm run lint` | **Aprovado**, sem warnings ou erros de ESLint após a correção; permanece o aviso de depreciação de `next lint`. |
| Build Pages (`npm run build` com as variáveis acima) | **Aprovado**: build de produção e export estático concluídos. |
| Arquivos exportados | **Aprovado**: `out/index.html`, `out/404.html`, `out/icon.svg`, `out/manifest.webmanifest`, `out/robots.txt` e `out/sitemap.xml` existem. |
| Integridade de recursos do HTML exportado | **Aprovada**: 56 referências locais `src`, `href` e `poster` verificadas contra arquivos de `out/`. |
| Regressão canonical/Open Graph | **Aprovada no HTML gerado**: ambos são `https://viniciusufersa.github.io/instituto-semeando-futuro/`; o subcaminho ocorre uma vez. |
| Sitemap, robots e manifest do Pages | **Aprovados**: sitemap contém o domínio/caminho Pages; robots aponta ao sitemap sob o mesmo subcaminho; manifest usa `/instituto-semeando-futuro/` e `/instituto-semeando-futuro/icon.svg`. |
| Navegação por teclado da galeria | **Aprovada no navegador automatizado**: foco no controle Próxima e Enter avançaram o item; o anúncio mudou de `Imagem 1 de 10` para `Imagem 2 de 10` e o foco permaneceu no controle. Árvore acessível contém 10 slides; as outras 20 cópias aparecem como ocultas/inertes. |
| Menu móvel por teclado | **Aprovado no navegador automatizado**: ao abrir, Tab alcança “Quem Somos”; Escape fecha o menu, oculta o `<nav>` e devolve foco ao botão. Selecionar “Projetos” atualiza `#projetos`, fecha o menu e mantém foco no controle. |
| Menu ao redimensionar | **Aprovado no navegador automatizado**: menu aberto a 768 px foi fechado ao passar a 1024 px; nav ficou visível em layout desktop, botão móvel oculto e foco transferido ao primeiro link. |
| Cartões ODS | **Aprovados por inspeção DOM no navegador**: seis cartões existem e nenhum tem atributo `tabindex`; permanecem artigos informativos sem ação. |
| Movimento reduzido | **Aprovado no navegador automatizado**: em `reduce`, os seis vídeos da galeria pausaram, o vídeo do Hero ficou pausado e permaneceu no mesmo `currentTime` ao rolar de 1200 a 2000 px, `scroll-behavior` computado foi `auto`, transformações dos cartões foram `none` e o conteúdo `Reveal` estava visível. O botão de topo voltou a `scrollY=0` e deixou o foco em `#hero-title`, não no botão oculto. |
| Responsividade | **Aprovada por verificação automatizada de geometria em 390×844, 768×1024 e 1280×900**: `documentWidth` não excedeu `clientWidth`; os controles da galeria mantiveram 44×44 px e ficaram dentro do viewport. Não foi observado overflow horizontal. |
| Console do navegador | **0 erros** durante os cenários. Persistiram 6 avisos Next.js de proporção de imagens SVG dos cartões ODS; nenhum envolve as mudanças funcionais desta intervenção. |
| `git diff --check` | **Aprovado**, sem erros de whitespace no diff versionado. |

Os testes interativos foram executados com Playwright no servidor Next.js local de desenvolvimento, com base path Pages configurado. A compilação final e as verificações de canonical/artefatos foram feitas no build estático de produção. O navegador foi testado em larguras representativas, mas não houve sessão manual com leitor de tela ou dispositivo móvel físico. Os snapshots e logs gerados pelo Playwright permanecem em `.playwright-mcp/` como artefatos locais não versionados desta execução.

### Limitações e regressões possíveis

- Os vídeos da galeria agora começam a tocar depois da hidratação do componente, quando movimento reduzido não está ativo, em vez de depender do atributo HTML `autoPlay`. No navegador automatizado os seis vídeos iniciaram; políticas do navegador ainda podem recusar `play()`, caso em que permanecem no quadro estático. Nenhuma dependência foi adicionada.
- A validação automatizada usou um navegador desktop Chromium, inclusive ao redimensionar para larguras menores. VoiceOver, NVDA, TalkBack, interação touch real, Safari/iOS e Android não foram testados manualmente.
- Os avisos existentes de tamanho/proporção em SVGs ODS e de raiz local do workspace inferida pelo lockfile ancestral permanecem. ESLint continua avisando que `next lint` será removido no Next 16. Nenhum deles impediu as verificações.
- Não foram medidos tráfego de mídia, custo de decodificação, memória, bateria, tamanho total do bundle nem desempenho. Não foram feitas otimizações de desempenho.

### Pendências para F0.4

- Medir o custo de rede/decodificação e o tamanho dos vídeos da galeria e do Hero em condições reproduzíveis; decidir sobre mudanças somente após essas medições.
- Fazer QA manual com leitor de tela e ao menos um dispositivo touch real, especialmente anúncios da galeria, foco após navegação por âncora e preferência de movimento reduzido.
- Investigar os avisos de proporção dos ícones SVG ODS se a etapa de QA visual confirmar distorção. Não foram corrigidos aqui porque as imagens não foram redimensionadas nesta intervenção.

### Critérios de aceite da F0.3

| Critério | Estado |
|---|---|
| Defeito canonical/OG continua corrigido e não regrediu no export | **Aprovado** |
| Galeria navegável por teclado, controles nomeados e clones repetidos excluídos da árvore acessível | **Aprovado no Chromium automatizado** |
| Menu móvel fecha por Escape e seleção de link, expõe estado/controle ARIA e mantém foco visível após fechamento/redimensionamento | **Aprovado no Chromium automatizado** |
| Elementos informativos ODS fora da sequência de Tab; links/botões verificados com nomes acessíveis | **Aprovado por inspeção DOM/árvore acessível** |
| Vídeos, túnel, smooth scroll, Reveal, Lenis e progressão respeitam movimento reduzido nos cenários testados | **Aprovado no Chromium automatizado** |
| TypeScript, lint, build estático, recursos e responsividade nas três larguras representativas | **Aprovado localmente** |
| QA manual em leitor de tela, dispositivo físico e publicação no GitHub Pages | **Não executado**; não foi requisito de publicação nesta intervenção e permanece registrado para confirmação posterior. |

Estado final: branch `audit/f0-estabilizacao-20261027`; HEAD `1c98a31ba79acdd157afcfb47296872bd49a9981`. As alterações locais da F0.2A/F0.2B e o trabalho visual preexistente em `app/globals.css` e `components/sections.tsx` foram preservados, com as adições pontuais descritas nesta seção. `package.json` e `package-lock.json` não foram alterados nesta intervenção. O workflow de deploy, a correção de `app/layout.tsx` e os relatórios anteriores foram preservados. Não houve commit, push, merge, PR, publicação ou alteração remota.

**Recomendação objetiva: aprovar o encerramento da F0.3 no escopo local desta branch.** Os problemas funcionais especificados foram corrigidos e exercitados com navegador automatizado; a exportação estática final também passou nas verificações. A ausência de QA manual em leitor de tela/dispositivo real é uma limitação registrada, não uma falha observada nem evidência de regressão. A F0.4 não foi iniciada.
