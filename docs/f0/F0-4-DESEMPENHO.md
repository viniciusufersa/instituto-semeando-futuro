# F0.4 — Auditoria e Otimização de Desempenho

**Data:** 27/10/2026
**Branch:** `audit/f0-estabilizacao-20261027`
**HEAD-base e final:** `1c98a31ba79acdd157afcfb47296872bd49a9981`
**Referências:** relatórios F0.1, F0.2A, F0.2B e F0.3. Os relatórios anteriores foram preservados.

## Resultado

**Recomendação: aprovar a F0.4 no escopo local.** Foram observados carregamento e reprodução de vídeos da galeria antes de estarem próximos do viewport e download integral do vídeo do Hero já na carga inicial. Com duas mudanças localizadas, o tráfego de recursos da navegação inicial caiu de 9.580.711 para 795.236 bytes (redução medida de 91,7%) nas condições descritas abaixo. O vídeo do Hero continua visível e controlado pela rolagem; a galeria mantém o Embla, os controles de teclado e o comportamento de movimento reduzido.

## Preservação e estado inicial

Antes das alterações, o checkout estava na branch `audit/f0-estabilizacao-20261027`, HEAD `1c98a31ba79acdd157afcfb47296872bd49a9981`. Permaneciam as alterações locais já existentes das etapas anteriores, incluindo os dois arquivos de interface, dependências/lockfile, workflows, relatórios e artefatos locais `.playwright-mcp/`. Não foram usados comandos de reset/checkout destrutivo, nem houve alteração remota.

O primeiro acesso de medição herdou `prefers-reduced-motion: reduce` da sessão anterior do navegador e foi descartado como baseline. A comparação válida abaixo foi repetida explicitamente com `no-preference`, tanto antes quanto depois da otimização.

## Metodologia e medições reproduzíveis

- Windows; Node.js `v24.14.1`; npm `11.11.0`; Next.js `15.5.28`.
- Chromium `156.0.0.0`, viewport `1280×900`, preferência `no-preference`, sem limitação artificial de rede/CPU.
- Em cada ponto foi executado `npm run build` com `GITHUB_ACTIONS=true`, `NEXT_PUBLIC_BASE_PATH=/instituto-semeando-futuro` e `NEXT_PUBLIC_SITE_URL=https://viniciusufersa.github.io/instituto-semeando-futuro`.
- O navegador acessou a pasta `out/` por servidor HTTP local com suporte a Range e `Cache-Control: no-store`; a mesma origem e configuração foram usadas antes e depois. A carga inicial foi amostrada após 2,5 s. Bytes são `PerformanceResourceTiming.transferSize`, incluindo cabeçalhos de resposta locais; não representam TTFB nem uma estimativa de CDN.
- LCP e CLS foram obtidos por `PerformanceObserver` com buffer. Seek foi medido em um percurso programático reproduzível de 1.800 px pelo Hero, em passos de 16 ms; não equivale a avaliação subjetiva de fluidez em dispositivo móvel.

| Métrica — carga inicial sem rolagem | Antes | Depois | Observação |
|---|---:|---:|---|
| Recursos registrados | 20 | 14 | Seis solicitações a menos. |
| Transferência total observada | 9.580.711 bytes | 795.236 bytes | Redução de 8.785.475 bytes (91,7%). |
| Transferência de vídeo | 8.807.706 bytes | 28.587 bytes | Antes havia download de vídeo da galeria fora da tela. |
| Vídeo do Hero | 1.502.847 bytes | 28.587 bytes | `preload="auto"` passou a `preload="metadata"`; redução inicial de 98,1%. |
| Vídeos da galeria | 7.304.859 bytes | 0 bytes | Antes, seis solicitações de mídia (incluindo cópias); depois, nenhuma antes de a galeria se aproximar do viewport. |
| LCP observado | 124 ms; elemento `SPAN`, 54.264 px² | 108 ms; elemento `SPAN`, 52.136 px² | Diferença pequena em uma execução local sem throttling; não é tratada como ganho causal. |
| CLS observado | 0,00595 (três entradas) | Nenhuma entrada observada | Resultado restrito à sessão e janela de observação; não é declaração de CLS de campo. |
| Tarefas longas (≥50 ms) | Nenhuma observada | Nenhuma observada no percurso de rolagem | A instrumentação não registra tarefas abaixo do limiar. |

Antes, os seis vídeos das três cópias da galeria iniciavam reprodução sem interação de rolagem; o WebM de 2,76 MiB foi transferido integralmente duas vezes, além de uma cópia integral do MP4 de 1,45 MiB e solicitações de metadados. Após a mudança, ao aproximar a galeria no desktop, somente dois vídeos que intersectavam o viewport começaram a tocar: uma solicitação de `sede-instituto-01.mp4` (1.516.729 bytes) e uma de `galeria-instituto-semeando-futuro-01.webm` (2.893.615 bytes). As quatro cópias fora da tela permaneceram pausadas, com `readyState=0`, e sem solicitar mídia. O aumento de tráfego quando a galeria fica visível é esperado e corresponde a mídia então apresentada.

No percurso de rolagem de 1.800 px, o Hero completou scrub até `currentTime=7,40 s` de 8,008 s em aproximadamente 2,06 s e gerou 23 atribuições de `currentTime`; antes foram observadas 21 atribuições no mesmo percurso. O número varia com o agendamento de frames e conclusão de seeks. A opção de metadados transferiu 28.587 bytes na carga inicial e o navegador buscou faixas adicionais conforme a rolagem; em uma execução o total do Hero ao chegar a 7,68 s foi 221.014 bytes. Não houve tarefas longas observadas nem foi removido o controle do vídeo pela rolagem.

## Classificação dos achados

### Problemas confirmados

| Achado | Impacto | Esforço | Evidência |
|---|---|---|---|
| `preload="auto"` fazia o vídeo de abertura de 1,43 MiB ser integralmente transferido no carregamento inicial, embora o vídeo permaneça pausado e seja usado para scrub por rolagem. | Alto na rede móvel; baixo esforço. | Baixo | 1.502.847 bytes antes; 28.587 bytes para metadados depois. A imagem do primeiro quadro continuou visível no Chromium. |
| `GalleryVideo` chamava `play()` no efeito de montagem para as cópias repetidas, mesmo com a galeria abaixo da dobra. | Alto na rede/decodificação inicial; baixo esforço. | Baixo | 7.305.159 bytes e seis elementos de vídeo da galeria reproduzindo na captura inicial; zero solicitações iniciais após a mudança. |

### Riscos potenciais

- O Hero pode solicitar faixas adicionais ao usuário percorrer a animação. O teste local chegou perto do final e transferiu 221.014 bytes; velocidades/conectividade diferentes podem produzir mais seeks ou espera durante a decodificação. Isso não foi avaliado em uma rede móvel limitada.
- Quando a preferência reduzida está ativa e um vídeo da galeria se torna visível, o componente solicita metadados para apresentar o quadro estático, mas não inicia reprodução. Em um teste Chromium, quatro clones continuaram sem solicitação e os dois itens visíveis permaneceram pausados.
- A busca no código encontrou `components/hero-orbit.tsx` sem importação/uso fora da própria definição, embora F0.1 e F0.2A tenham registrado que a cena 3D era usada. O arquivo histórico foi preservado. As dependências 3D não foram removidas: não foi demonstrado que seu código esteja no caminho inicial servido, nem que removê-las altere as métricas medidas; a divergência de inventário fica registrada para não converter uma limpeza de dependência em otimização sem benefício comprovado.
- O teste foi em Chromium desktop e servidor local sem throttling. Não representa largura de banda, latência, economia de bateria ou fluidez em aparelho real.

### Sem intervenção necessária

- A compilação de produção reportou o mesmo tamanho Next para a rota antes e depois: página `106 kB`, First Load JS `209 kB` (partilha de `103 kB`). Não houve alteração de componentes JavaScript além do controle de reprodução da galeria. Não foi demonstrada redução necessária no bundle nesta etapa.
- Os recursos de imagem fotográfica já são WebP. Foram inventariados 13 arquivos raster, com larguras de 960–1.200 px e tamanhos de 158.598–334.066 bytes. Na primeira dobra foram solicitados logo, ícone do site e fonte local; as fotografias não entraram no tráfego inicial. Não foi feita recompressão ou troca de imagens sem evidência de defeito visual.
- A galeria permanece com 30 elementos de slide para manter seu ciclo contínuo de 10 itens; os 20 duplicados permanecem `aria-hidden`/`inert` conforme F0.3. Esta intervenção reduz carregamento e decodificação de mídia sem reescrever o carrossel nem reduzir suas cópias visuais.
- O percurso do Hero resultou em 21 seeks antes e 23 depois em execuções únicas e não produziu tarefa longa observável. O algoritmo já impede novo seek enquanto o elemento está em `seeking` e aplica o destino mais recente. Não há evidência suficiente para alterar a cadência e arriscar o efeito de scrub.

## Alterações implementadas

| Arquivo | Alteração desta F0.4 | Justificativa |
|---|---|---|
| `components/hero.tsx` | `preload` do vídeo passou de `auto` para `metadata`. | Evita baixar o arquivo inteiro antes de o scrub demandar outras faixas, preservando o vídeo e seu controle pela rolagem. |
| `components/sections/gallery-section.tsx` | Vídeos iniciam com `preload="none"`; `IntersectionObserver` com margem de 100 px controla quando são carregados e reproduzidos. Vídeos fora da área são pausados; movimento reduzido mantém pausa e solicita metadados somente para mídia próxima/visível. | Não carregar/decodificar em segundo plano as cópias de vídeo da galeria antes de serem necessárias. |
| `docs/f0/F0-4-DESEMPENHO.md` | Criado este relatório, sem editar os registros históricos. | Registrar condições, resultados e limites desta etapa. |

Sem alterações em dependências/lockfile, imagens, workflows, dados, conteúdo, layout, navegação, controle de teclado ou identidade visual. O projeto continua sendo exportação estática e compatível com o subcaminho do GitHub Pages.

## Verificações pós-alteração

| Verificação | Resultado |
|---|---|
| `npm run typecheck` | **Aprovado** (`tsc --noEmit`). |
| `npm run lint` | **Aprovado**, sem warnings/erros de ESLint. Permanecem o aviso de depreciação de `next lint` e a inferência da raiz do workspace pelo lockfile ancestral local. |
| Build de produção Pages | **Aprovado** com as variáveis Pages indicadas; Next.js `15.5.28`; exportação concluída. First Load JS permanece `209 kB`. |
| Arquivos exportados e referências | **Aprovado** por script com `node:assert/strict`: `index.html`, `404.html`, `icon.svg`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`; 76 referências locais verificadas, nenhuma ausente. Canonical/OG, sitemap, robots e caminhos do manifest continuaram corretos. |
| Chromium — primeira dobra e mídia | **Aprovado**: o primeiro quadro do Hero continuou visível com metadados; carga inicial de 795.236 bytes. Vídeos da galeria não foram solicitados até a aproximação ao viewport. |
| Chromium — galeria funcional | **Aprovado**: ao chegar à galeria, os dois vídeos visíveis tocaram; cópias fora do viewport permaneceram sem carregar. Enter no botão “Próxima imagem” mudou o anúncio ao vivo de “Imagem 1 de 10” para “Imagem 2 de 10” e manteve o foco no botão. |
| Chromium — menu/teclado | **Aprovado para regressão**: abrir com Enter, Tab alcança “Quem Somos”, Escape define `aria-expanded=false` e devolve foco ao botão do menu. |
| Chromium — `prefers-reduced-motion` | **Aprovado**: vídeo Hero pausado e `currentTime` invariável durante rolagem; seis vídeos da galeria pausados; somente os dois vídeos próximos/visíveis solicitaram metadados, sem reproduzir; rolagem computada `auto` e transformação do cartão `none`. |
| Chromium — larguras | **Aprovado** em 390×844, 768×1024 e 1280×900: sem overflow horizontal; controles da galeria mediram 44×44 px e permaneceram no viewport ao focalizar a seção. |
| Console do navegador | **Aprovado** no acesso de produção estática pós-build: nenhum erro ou aviso novo. Avisos vistos anteriormente em logs históricos provinham de uma sessão Next dev anterior e não foram atribuídos a este export. |
| `git diff --check` e verificação de whitespace do relatório novo | **Aprovados**; sem erros ou espaços ao fim das linhas. |

Não foi repetido `npm ci` nem `npm audit`: não houve alteração de dependências e essas verificações pertencem à F0.2A. Não houve execução no GitHub, publicação, teste em rede móvel limitada, dispositivo físico ou medição de bateria.

## Riscos, pendências e limites

- Metadados podem provocar solicitações adicionais quando o vídeo do Hero busca quadros durante a rolagem; a quantidade dependerá do percurso e do navegador. O teste confirmou a manutenção do scrub, mas foi feito em rede local rápida.
- Métricas de LCP/CLS foram colhidas em sessões únicas sem throttling. As diferenças pequenas não foram usadas para alegar ganho de renderização; a evidência principal é o volume de mídia que deixou de ser buscado antes de ser necessário.
- O conjunto de imagens não foi recomprimido; todas já são WebP e ficam abaixo de 335 KB, e não carregaram na primeira dobra observada. A qualidade/responsividade visual não justificou alteração.
- Não foram executados testes em dispositivo físico, rede celular lenta, Safari/iOS ou Android. Essas condições não podem ser declaradas aprovadas por esta medição desktop.
- O inventário de dependências 3D mencionado acima deve ser conciliado antes de qualquer futura decisão de limpeza, sem remover os pacotes nesta fase.

## Arquivos e estado final

Alterações desta fase: `components/hero.tsx`, `components/sections/gallery-section.tsx` e o relatório novo `docs/f0/F0-4-DESEMPENHO.md`. Permaneceram intactos o conteúdo de `.playwright-mcp/` e as alterações locais preexistentes de F0.1–F0.3. Os artefatos `.playwright-mcp/` continuaram não versionados e não foram adicionados ao Git.

Branch `audit/f0-estabilizacao-20261027`; HEAD `1c98a31ba79acdd157afcfb47296872bd49a9981`. Não houve commit, push, merge, PR, publicação, operação remota ou alteração de dependências.

## Critérios de aceite

| Critério | Estado |
|---|---|
| Gargalos medidos antes e reavaliados sob as mesmas condições | **Aprovado localmente**; 91,7% menos bytes na carga inicial observada. |
| Hero mantém visual inicial e scrub pela rolagem | **Aprovado no Chromium automatizado**; metadados no carregamento e faixas adicionais sob demanda. |
| Vídeos da galeria só carregam/reproduzem próximos da área apresentada; clones fora dela não antecipam downloads | **Aprovado no Chromium automatizado**. |
| Movimento reduzido, teclado, responsividade e export estática preservados | **Aprovado localmente** nos cenários documentados. |
| TypeScript, ESLint, build e referências exportadas | **Aprovado localmente**. |
| Rede móvel/dispositivo físico e execução remota do Pages | **Não executado**; este relatório não declara esses ambientes aprovados. |

**Recomendação objetiva: aprovar a F0.4 no escopo local e encerrar esta etapa.** Os custos iniciais confirmados foram reduzidos sem retirar vídeo, conteúdo, navegação ou animações; testes funcionais e export estática passaram. As limitações de rede/dispositivo estão explícitas, e não há evidência que justifique um ciclo adicional de otimizações nesta etapa. A F0.5 não foi iniciada.
