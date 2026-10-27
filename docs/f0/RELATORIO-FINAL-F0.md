# Relatório Final — F0: Auditoria Técnica e Estabilização

**Projeto:** Instituto Semeando o Futuro\
**Repositório:** `viniciusufersa/instituto-semeando-futuro`\
**Branch local:** `audit/f0-estabilizacao-20261027`\
**Commit original e HEAD local:** `1c98a31ba79acdd157afcfb47296872bd49a9981`
**Data da validação final:** 27/10/2026

## 1. Resumo executivo

A rodada F0.5 consolidou os resultados já aceitos localmente das etapas F0.1, F0.2A, F0.2B, F0.3 e F0.4. A validação local final passou em instalação limpa, TypeScript, ESLint, auditorias npm, exportação estática do GitHub Pages, inspeção dos metadados e referências exportadas, regressões automatizadas com Chromium e `git diff --check`.

**Recomendação:** aprovar o encerramento técnico local da F0. Não foram encontrados bloqueios críticos na branch local. A liberação remota permanece pendente: a `main` está sem proteção, o workflow de PR existe apenas localmente e não há execução remota desse CI. Nenhuma operação remota, publicação ou alteração de regras foi realizada.

## 2. Estado preservado do Git

- Branch: `audit/f0-estabilizacao-20261027`.
- HEAD: permanece em `1c98a31ba79acdd157afcfb47296872bd49a9981`; não houve commit.
- Nenhuma alteração staged.
- Há alterações locais acumuladas e ainda não publicadas. Nenhuma foi descartada ou revertida.
- `app/globals.css` e `components/sections.tsx` já continham mudanças visuais antes da F0. As mudanças da F0 nesses arquivos são incrementais e relacionadas a acessibilidade; o diff total desses arquivos não deve ser atribuído integralmente à F0.
- `.playwright-mcp/` contém logs, snapshots e captura usados na validação local. Permanece não versionada e não integra a entrega.
- Os relatórios anteriores foram preservados sem reescrita. Este documento é o novo relatório final.
- Não houve commit, push, merge, pull request, deploy nem alteração remota.

## 3. Inventário consolidado

| Arquivo ou grupo | Alteração acumulada da F0 |
|---|---|
| `package.json`, `package-lock.json` | Atualização compatível para Next.js e `eslint-config-next` 15.5.28 e override de PostCSS 8.5.25. React 19.1.1 e TypeScript foram mantidos. |
| `.github/workflows/deploy-github-pages.yml` | Runtime do job de publicação atualizado de Node.js 20 para Node.js 24. O gatilho existente foi preservado. |
| `.github/workflows/validate-pr.yml` | Novo workflow local de validação de PR destinado à `main`, com permissões de leitura, instalação, typecheck, lint, audit de produção, build/export estático e conferência de arquivos. Não publica o site. |
| `app/layout.tsx` | Ajuste de `metadataBase` para impedir duplicação do subcaminho nas URLs canonical e Open Graph do Pages. |
| `app/page.tsx`, `components/site-header.tsx`, `components/site-footer.tsx`, `components/sections.tsx`, `components/sections/gallery-section.tsx`, `components/hero.tsx`, `components/experience.tsx`, `app/globals.css` | Ajustes localizados de navegação por teclado, menu móvel, semântica e nomes acessíveis, controles da galeria, movimento reduzido e carregamento/reprodução de mídia. `globals.css` e `sections.tsx` também contêm alterações anteriores à F0. |
| `docs/f0/` | Relatórios históricos F0.1–F0.4 preservados; este documento consolida a validação final. |

A revisão do escopo e dos relatórios não identificou funcionalidades das fases F1–F5, mudanças de conteúdo institucional nem alterações no Ninho Social. As mudanças de código correspondem à estabilização documentada. As configurações, dependências e os dois workflows permanecem coerentes: validação em PR é separada da publicação.

## 4. Resultados consolidados das etapas anteriores

- **F0.1 — Baseline:** registrou a condição inicial, riscos de dependências, incompatibilidade do runtime e defeito de canonical/Open Graph. O relatório histórico foi mantido.
- **F0.2A — Dependências e runtime:** atualizou Next.js e configuração ESLint dentro da linha 15, manteve React/TypeScript e adotou Node.js 24 nos workflows. Os relatórios documentam a análise de advisories e `camera-controls`.
- **F0.2B — CI e governança:** criou a validação de PR sem permissões de publicação. Registrou a ausência de suíte automatizada e a necessidade de regras remotas para a `main`.
- **F0.3 — Estabilização funcional:** corrigiu URLs canonical/OG e implementou os ajustes localizados de teclado, menu, galeria e movimento reduzido. Os resultados de Chromium estão registrados no relatório da etapa.
- **F0.4 — Desempenho:** validou e aplicou carregamento de mídia mais conservador. A medição documentada comparou 9.580.711 bytes com 795.236 bytes de mídia inicialmente carregada na configuração aferida, redução observada de 91,7%. A medição vale para aquele cenário local e não substitui teste em dispositivos ou redes reais.

## 5. Validação técnica da F0.5

### Ambiente e comandos

Ambiente observado: Node.js `v24.14.1`, npm `11.11.0`, Next.js `15.5.28`.

| Verificação | Resultado observado |
|---|---|
| `npm ci` | **PASSOU** — instalação limpa; 404 pacotes auditados, zero vulnerabilidades. Exibiu avisos de depreciação transitiva, sem falha de instalação ou erro de engine. |
| `npm run typecheck` | **PASSOU**. |
| `npm run lint` | **PASSOU**, sem erros ou warnings do ESLint. O comando ainda usa `next lint`, que Next.js marca como depreciado; também foi emitido aviso de inferência da raiz do workspace por existir um `pnpm-lock.yaml` em diretório ancestral. São avisos não bloqueantes. |
| `npm audit` | **PASSOU** — zero vulnerabilidades encontradas. |
| `npm audit --omit=dev` | **PASSOU** — zero vulnerabilidades encontradas nas dependências de produção. |
| `npm run build` com variáveis de Pages | **PASSOU** — build de produção e exportação estática concluídos. |
| Arquivos essenciais exportados | **PASSOU** — `out/index.html`, `out/404.html`, `out/icon.svg`, `out/manifest.webmanifest`, `out/robots.txt` e `out/sitemap.xml` presentes. |
| Referências locais da exportação | **PASSOU** — 76 referências verificadas, nenhuma ausente. |
| Canonical e Open Graph | **PASSOU** — ambas apontam para `https://viniciusufersa.github.io/instituto-semeando-futuro/`, com o subcaminho uma única vez. |
| Sitemap, robots e manifest | **PASSOU** — caminhos e URL base coerentes com a publicação no GitHub Pages. |
| `git diff --check` | **PASSOU** — sem erros de whitespace no diff rastreado. |

Variáveis utilizadas para o build estático:

```text
GITHUB_ACTIONS=true
NEXT_PUBLIC_BASE_PATH=/instituto-semeando-futuro
NEXT_PUBLIC_SITE_URL=https://viniciusufersa.github.io/instituto-semeando-futuro
```

### Workflows

A inspeção estática confirmou que `validate-pr.yml` é acionado por pull requests destinados à `main`, usa Node.js 24 e `contents: read`, executa as verificações locais e não contém permissão de escrita do Pages, criação de deployment ou etapa de publicação. O workflow de deploy continua acionado por push na `main` e por execução manual (`workflow_dispatch`), usa Node.js 24 e mantém suas permissões de publicação. Portanto, um push na `main` inicia atualmente o deployment automático.

Essa confirmação é local e estática. O workflow de PR ainda não foi publicado nem executado pelo GitHub; não se declara aprovação remota do Actions.

## 6. Regressão funcional automatizada

Foi usado Chromium automatizado sobre a exportação estática de produção servida localmente sob o subcaminho do GitHub Pages.

- **Estrutura da página:** sete seções principais presentes; console da página final sem erros ou warnings.
- **Menu e teclado:** após rolar além do limiar existente em que o cabeçalho se torna visível, Enter abriu o menu, Tab moveu o foco para o link “Quem Somos” e Escape fechou o menu e devolveu o foco ao botão acionador. O cabeçalho permanece intencionalmente oculto no início do Hero, comportamento existente.
- **Galeria:** Enter no controle “Próxima imagem da galeria” avançou o item e atualizou o anúncio acessível; o foco permaneceu no controle. Vídeos fora da área visível ficaram pausados e sem carregamento inicial.
- **Movimento reduzido:** com `prefers-reduced-motion: reduce`, Hero permaneceu pausado durante a rolagem, vídeos da galeria permaneceram pausados, a rolagem programática ficou sem movimento suave e o transform animado da galeria foi removido.
- **Vídeo e carregamento:** Hero exportado usou `preload=metadata`; vídeos da galeria começaram com `preload=none`, sem requisições de vídeo antes de rolar até a galeria. A reprodução observada ficou limitada aos vídeos visíveis.
- **Responsividade:** larguras de 390, 768 e 1280 px sem overflow horizontal; controles observados com área de 44×44 px e dentro da viewport quando a seção estava visível.

Não foram executados testes com leitor de tela nem em dispositivos físicos. Esses cenários permanecem limitações de validação, não resultados aprovados. O repositório não possui suíte automatizada convencional nem script `test`; os cenários acima são regressões pontuais automatizadas no navegador, não uma suíte geral.

## 7. Problemas resolvidos e evidências

| Problema inicial | Estado final local | Evidência |
|---|---|---|
| Canonical/OG duplicavam `/instituto-semeando-futuro` | Resolvido | HTML efetivamente exportado contém as URLs corretas, com o subcaminho uma vez. |
| Dependências vulneráveis no baseline | Resolvido na auditoria atual | `npm audit` e `npm audit --omit=dev`: zero vulnerabilidades após `npm ci`. |
| Aviso de engine de `camera-controls` no Node.js 20 | Tratado pela adoção do Node.js 24 | Instalação limpa em Node 24 sem `EBADENGINE`; build e comandos passaram. |
| Menu e galeria com barreiras de navegação por teclado | Corrigido nos cenários automatizados | Abertura, navegação, Escape, foco, anúncio e avanço foram observados em Chromium. |
| Movimento reduzido e carregamento inicial de vídeos | Tratado | Comportamento observado em Chromium e exportação final. |
| Ausência de CI independente de PR | Implementado localmente | Workflow estático validado; execução remota continua pendente. |

## 8. Segurança, riscos residuais e limitações

- As auditorias npm atuais não reportam vulnerabilidades. Isso é o resultado do lockfile auditado em 27/10/2026 e não garante ausência de advisories futuros.
- O projeto não tem suíte de testes automatizados; os workflows não simulam testes inexistentes.
- A validação visual/interativa foi automatizada em Chromium local. Leitores de tela, dispositivos reais e redes móveis não foram verificados.
- Avisos não bloqueantes permanecem para `next lint` depreciado, detecção da raiz do workspace e pacotes transitivos depreciados. Não houve atualização adicional de dependências nesta etapa.
- O relatório F0.4 registra que `components/hero-orbit.tsx` não tem referência de uso encontrada, mas não foi removido sem evidência de impacto mensurável no bundle/runtime. Isso não bloqueia o aceite da F0.
- O build e a verificação local não provam que o Pages remoto publicará corretamente antes de uma execução autorizada no GitHub.

## 9. Governança remota e publicação

Consultas remotas somente de leitura realizadas em 27/10/2026 confirmaram:

- A branch `main` aponta para o commit original e aparece sem proteção ativa (`protected: false`).
- A consulta de rulesets do repositório retornou lista vazia (`[]`).
- Em `main`, o GitHub lista apenas `deploy-github-pages.yml`; `validate-pr.yml` ainda não está publicado.
- A consulta de execuções encontrou uma execução antiga bem-sucedida do workflow de deploy, de 03/08/2026, no commit original; não há execução do novo CI de PR.
- O endpoint de detalhes de proteção retornou 403 para a integração, mas o metadado da branch e a consulta de rulesets acima confirmam a ausência de proteção/ruleset observável.

Consequentemente, **a liberação remota não está aprovada**. O conjunto local ainda não pode ser tratado como protegido contra alterações diretas e o CI obrigatório não foi publicado/executado.

### Procedimento remoto posterior — requer autorização explícita

1. Revisar e preservar o diff local completo; manter `.playwright-mcp/` fora do conjunto versionável.
2. Configurar regras para `main`: exigir pull request, impedir push direto não autorizado, exigir o check de CI aprovado e bloquear merge enquanto estiver pendente/reprovado; restringir bypass conforme plano e permissões disponíveis.
3. Autorizar e publicar a branch de auditoria com os arquivos revisados.
4. Abrir pull request autorizado para `main` e aguardar a execução do workflow de validação.
5. Revisar o diff e o resultado do CI; o proprietário toma decisão explícita sobre merge.
6. Somente após autorização de merge, observar o deployment acionado pelo push na `main` e verificar a publicação.

Este procedimento é documentação; nenhuma dessas operações foi iniciada.

## 10. Pendências por classificação

### Bloqueio para liberação remota

- Ativar proteção/regras para `main` e exigir as verificações aplicáveis.
- Publicar o workflow de PR por meio de operação autorizada e confirmar sua execução real.
- Obter revisão e autorização explícita do proprietário para merge e deployment.

### Limitações documentadas e aceitas para o encerramento técnico local

- Sem suíte automatizada geral, leitores de tela ou dispositivos físicos.
- Avisos de depreciação do lint e de pacotes transitivos.
- Execução remota do CI e deployment ainda não observados.

### Itens das fases posteriores

Conteúdo histórico, estatísticas institucionais, novas funcionalidades e demais itens previstos no planejamento F1–F5 permanecem fora da F0 e não foram reabertos nesta validação. Ajustes de acessibilidade e desempenho já concluídos na F0.3/F0.4 não devem ser confundidos com autorização para expansão de escopo.

## 11. Checklist de aceite

- [x] Branch, HEAD e estado Git registrados e preservados.
- [x] Relatórios F0.1–F0.4 preservados; alterações pré-existentes em `app/globals.css` e `components/sections.tsx` identificadas.
- [x] Diff acumulado revisado quanto ao escopo F0, conteúdo institucional, workflows e dependências.
- [x] Instalação limpa, TypeScript, lint e auditorias npm executados.
- [x] Build e exportação estática do GitHub Pages executados.
- [x] Arquivos essenciais, metadados, sitemap, robots, manifest e referências locais conferidos na saída.
- [x] Regressões direcionadas de teclado, menu, galeria, movimento reduzido e responsividade executadas em Chromium.
- [x] Workflows localmente separados e permissões do CI inspecionadas.
- [x] Sem commit, push, merge, pull request, mudança de regra remota ou deploy.
- [ ] Proteção de `main` configurada e CI de PR executado remotamente — pendente e necessário para liberação remota.
- [ ] Leitor de tela e dispositivos físicos — não executados; limitação documentada, não bloqueio do aceite técnico local.

## 12. Recomendação final

**Aceite técnico local:** recomendado. A base técnica e funcional da F0 está aprovada localmente na branch de auditoria, sem bloqueio crítico identificado. A F0 pode ser encerrada tecnicamente após avaliação deste relatório.

**Liberação remota:** pendente e não aprovada. Falta configurar proteção da `main`, publicar e executar o workflow de PR, revisar o resultado remoto e obter autorização explícita do proprietário para merge e deployment.

**Transição para F1:** pode ser recomendada após o aceite do usuário para o encerramento técnico da F0. A F1 não foi iniciada nesta execução.
