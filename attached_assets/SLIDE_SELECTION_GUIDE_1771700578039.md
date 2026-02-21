---
file: "SLIDE_SELECTION_GUIDE.md"
version: "1.0.0"
owner: "Conatus Ambiental"
language: "pt-BR"
scope: ["planner", "composer"]
related_files:
  - "PRESENTATION_AGENT_RULES.md"
  - "CONTENT_STYLE_GUIDE.md"
  - "slide type registry"
purpose: "Orientar a escolha do tipo de slide no planejamento e composição de apresentações"
---

# SLIDE_SELECTION_GUIDE — Conatus Ambiental

## 1) Objetivo deste guia

Este guia orienta **quando usar cada tipo de slide** do MVP, como combinar os templates em uma narrativa coerente e quais erros evitar na seleção.

Ele não substitui:
- o **schema/validator** (regras estruturais),
- o **registry** (componentes permitidos),
- nem o **PRESENTATION_AGENT_RULES.md** (regras globais de comportamento).

---

## 2) Slide types oficiais do MVP (nomes canônicos)

## 2.1 Base
- `cover`
- `closing`
- `section_divider`

## 2.2 Agenda
- `agenda_light`
- `agenda_dark`

## 2.3 Conteúdo claro
- `light_title_text_or_image`
- `light_two_columns`
- `light_chart_text`

## 2.4 Conteúdo escuro
- `dark_title_text_or_image`
- `dark_two_columns`
- `dark_chart_text`

> Regra geral: **não criar novos slide types no planejamento**. Se algo não couber, reorganizar conteúdo ou dividir em mais slides.

---

## 3) Estratégia de seleção por intenção (pergunta principal)

Antes de escolher um slide, responder:

**“Qual é a função deste slide na narrativa?”**

Use a intenção para escolher o tipo:

- **Abrir** → `cover`
- **Orientar o público** → `agenda_light` / `agenda_dark`
- **Separar blocos** → `section_divider`
- **Explicar uma ideia** → `*_title_text_or_image`
- **Comparar ou combinar duas coisas** → `*_two_columns`
- **Mostrar dado + interpretar** → `*_chart_text`
- **Encerrar / contato** → `closing`

---

## 4) Quando usar cada slide type (com exemplos)

## 4.1 `cover`
### Quando usar
- Sempre no início da apresentação.
- Em decks formais, institucionais, diretoria, cliente, treinamento e projeto.

### Melhor para
- Título do tema
- Subtítulo contextual
- Identificação institucional

### Exemplo de uso
- `Treinamento interno — Visão geral do projeto`
- `Projeto X — Status e próximos passos`

### Evitar usar quando
- Você quer já começar com conteúdo detalhado (use cover + slide de conteúdo depois)

---

## 4.2 `closing`
### Quando usar
- Sempre no fim da apresentação.

### Melhor para
- Encerramento
- Contato
- Mensagem final
- Próximos passos (resumidos)

### Exemplo de uso
- Contato da Conatus + e-mail + telefone
- “Obrigado” + próximos passos + canal de contato

### Evitar usar quando
- Ainda há conteúdo novo importante a ser apresentado

---

## 4.3 `section_divider`
### Quando usar
- Para marcar mudança clara de bloco/assunto.
- Quando o deck está longo e precisa de ritmo visual.

### Melhor para
- Transições como:
  - Contexto → Solução
  - Solução → Evidências
  - Evidências → Próximos passos

### Exemplo de uso
- `Diagnóstico Atual`
- `Proposta de Solução`
- `Plano de Implementação`

### Evitar usar quando
- O deck é muito curto (até 4–5 slides)
- A transição é muito pequena e não justifica um slide exclusivo

---

## 4.4 `agenda_light` / `agenda_dark`
### Quando usar
- Quando há múltiplos tópicos/seções.
- Em decks de treinamento e diretoria (geralmente útil).
- Em decks com 8+ slides.

### Melhor para
- Dar visão geral
- Alinhar expectativa
- Estruturar leitura/apresentação

### Como escolher light vs dark
- **Light**: quando o deck começa em estilo claro ou quer um ar mais “clean”.
- **Dark**: quando o deck usa identidade mais sóbria/técnica e quer contraste visual.

### Exemplo de uso
- Contexto
- Objetivos
- Etapas
- Resultados preliminares
- Próximos passos

### Evitar usar quando
- Deck curto e objetivo (ex.: 3–4 slides)

---

## 4.5 `light_title_text_or_image` / `dark_title_text_or_image`
### Quando usar
- Para explicar uma ideia principal por slide.
- Para slides conceituais, mensagens-chave ou conteúdo introdutório.
- Para texto com apoio visual opcional.

### Melhor para
- Contexto
- Objetivo
- Escopo
- Conceitos principais
- Mensagem institucional
- Observações importantes

### Como escolher light vs dark
- **Light**: melhor para leitura extensa e visual clean.
- **Dark**: melhor para destaque, contraste, ritmo, blocos estratégicos.

### Exemplo de uso
- `Objetivos e escopo do projeto`
- `Desafios operacionais observados`
- `Visão geral da solução`

### Evitar usar quando
- Você precisa comparar duas estruturas lado a lado (use `two_columns`)
- Você precisa mostrar dado numérico com gráfico (use `chart_text`)

---

## 4.6 `light_two_columns` / `dark_two_columns`
### Quando usar
- Quando o conteúdo naturalmente se divide em dois blocos.
- Para comparação, contraste ou complementaridade.
- Para texto + imagem.

### Melhor para
- Problema vs solução
- Antes vs depois
- Benefícios técnicos vs benefícios operacionais
- Explicação + exemplo visual
- Duas frentes de trabalho

### Como escolher light vs dark
- **Light**: ideal para comparações mais analíticas e leitura confortável.
- **Dark**: útil para slides de impacto/intermediários e narrativa visual mais forte.

### Exemplo de uso
- Coluna 1: `Problema atual`
- Coluna 2: `Abordagem proposta`

ou

- Coluna 1: imagem de processo
- Coluna 2: explicação em bullets

### Evitar usar quando
- Ambas as colunas ficarem com muito texto denso
- O conteúdo não tem relação clara entre os lados
- Você quer mostrar gráfico (use `chart_text`)

---

## 4.7 `light_chart_text` / `dark_chart_text`
### Quando usar
- Quando houver **dado explícito** e for importante mostrar evidência/indicador.
- Quando o insight precisa ser comunicado visualmente.

### Melhor para
- Comparativos simples
- Evolução temporal curta
- Indicadores de desempenho
- Resultados preliminares (com dados)
- Before/after com números

### Como escolher light vs dark
- **Light**: melhor para legibilidade de gráfico e interpretação.
- **Dark**: usar para contraste visual, desde que o gráfico continue legível.

### Exemplo de uso
- Gráfico de barras + texto explicando ganho operacional
- Gráfico de linha + texto explicando tendência observada

### Obrigatório neste tipo
- gráfico com dados fornecidos
- texto explicativo (insight)
- legenda/unidade/caption quando aplicável

### Evitar usar quando
- Não há dados
- O “gráfico” seria decorativo
- O dado é complexo demais para o template (dividir em 2 slides)

---

## 5) Regras práticas de escolha (atalhos úteis)

## 5.1 Se a informação é principalmente textual
Escolher primeiro:
- `*_title_text_or_image`

## 5.2 Se a informação tem duas partes equivalentes
Escolher primeiro:
- `*_two_columns`

## 5.3 Se a informação depende de número/evidência visual
Escolher primeiro:
- `*_chart_text`

## 5.4 Se o slide existe apenas para organizar o fluxo
Escolher:
- `agenda_*` ou `section_divider`

## 5.5 Se for início ou fim
Escolher:
- `cover` ou `closing`

---

## 6) Como montar sequências de slides (padrões recomendados)

## 6.1 Sequência base (genérica)
1. `cover`
2. `agenda_light` (ou `agenda_dark`)
3. `section_divider` (opcional)
4. `light_title_text_or_image`
5. `light_two_columns`
6. `dark_title_text_or_image`
7. `light_chart_text` (se houver dados)
8. `section_divider` (opcional)
9. `dark_two_columns`
10. `closing`

---

## 6.2 Sequência para treinamento (MVP)
1. `cover`
2. `agenda_light`
3. `section_divider` (módulo 1)
4. `light_title_text_or_image` (conceito)
5. `light_two_columns` (conceito + exemplo)
6. `section_divider` (módulo 2)
7. `dark_title_text_or_image` (ponto-chave)
8. `light_chart_text` (se houver dado)
9. `dark_two_columns` (resumo comparativo)
10. `closing`

**Heurística**: treinamento se beneficia de agenda + separadores + progressão didática.

---

## 6.3 Sequência para diretoria (MVP)
1. `cover`
2. `agenda_dark` (se necessário)
3. `light_title_text_or_image` (contexto)
4. `light_two_columns` (problema x proposta)
5. `light_chart_text` (indicador chave, se houver)
6. `dark_title_text_or_image` (implicações / decisão)
7. `dark_two_columns` (próximos passos / responsabilidades)
8. `closing`

**Heurística**: diretoria pede síntese, impacto e próximos passos.

---

## 6.4 Sequência para apresentação de projeto (MVP)
1. `cover`
2. `agenda_light`
3. `section_divider` (`Contexto`)
4. `light_title_text_or_image` (contexto + problema)
5. `light_two_columns` (objetivo + escopo)
6. `section_divider` (`Execução`)
7. `dark_two_columns` (etapas / frentes)
8. `light_chart_text` (cronograma/resultado parcial, se houver dado)
9. `section_divider` (`Encaminhamentos`)
10. `closing`

---

## 7) Critérios para escolher light vs dark (guia rápido)

## 7.1 Preferir slides claros quando
- há mais texto para leitura
- há gráfico detalhado
- o objetivo é clareza máxima
- o bloco é analítico/didático

## 7.2 Preferir slides escuros quando
- quer marcar transição/ênfase
- o conteúdo é mais sintético e de impacto
- quer contraste visual no ritmo do deck
- está alinhado ao padrão visual do bloco atual

## 7.3 Evitar
- alternar claro/escuro de forma mecânica (ex.: todo slide alternando)
- usar escuro em gráfico sem garantir legibilidade
- misturar muitos estilos no mesmo bloco sem intenção narrativa

---

## 8) Erros comuns de seleção (anti-padrões)

## 8.1 Usar `*_title_text_or_image` para tudo
Problema:
- deck fica monótono
- comparações e dados perdem clareza

Correção:
- usar `two_columns` para dualidade
- usar `chart_text` para dado

---

## 8.2 Usar `*_two_columns` quando não há duas partes reais
Problema:
- uma coluna fica vazia ou artificial
- leitura fica estranha

Correção:
- voltar para `*_title_text_or_image`

---

## 8.3 Usar `*_chart_text` sem dados explícitos
Problema:
- induz invenção ou gráfico decorativo

Correção:
- usar `*_title_text_or_image` com placeholder de dado
- ou usar `*_two_columns` com “dados a coletar” e “próximos passos”

---

## 8.4 Excesso de `section_divider`
Problema:
- deck perde fluidez e fica fragmentado

Correção:
- usar separador só quando muda bloco real de assunto

---

## 8.5 Agenda em deck curto
Problema:
- adiciona burocracia desnecessária

Correção:
- omitir agenda em decks muito curtos (até ~5 slides)

---

## 9) Regras de desempate (quando dois tipos parecem servir)

Quando houver dúvida entre dois slide types, aplicar esta ordem de decisão:

1. **Qual tipo comunica a intenção principal com menos esforço cognitivo?**
2. **Qual mantém melhor legibilidade no volume atual de conteúdo?**
3. **Qual evita overflow sem mutilar a mensagem?**
4. **Qual mantém mais consistência com a subseção atual?**
5. **Qual é o template mais simples?** (preferir o mais simples em caso de empate)

---

## 10) Tabela mental rápida (cheat sheet)

### Pergunta → Slide recomendado
- “É o começo?” → `cover`
- “É o fim / contato?” → `closing`
- “Preciso orientar a estrutura?” → `agenda_light` / `agenda_dark`
- “Mudei de bloco?” → `section_divider`
- “É uma ideia principal com texto/imagem?” → `*_title_text_or_image`
- “Tenho duas partes equivalentes?” → `*_two_columns`
- “Tenho dado + insight?” → `*_chart_text`

---

## 11) Regras de fallback (MVP)

Se o agente não tiver certeza sobre qual slide escolher:
1. usar `*_title_text_or_image` (light por padrão),
2. manter conteúdo enxuto,
3. sinalizar placeholders,
4. evitar `chart_text` sem dados.

Se o conteúdo estiver denso:
- dividir em dois slides em vez de forçar layout inadequado.

---

## 12) Integração com o planner/composer

## 12.1 No Planner
Este guia deve ser usado para:
- distribuir intenções ao longo da narrativa
- definir sequência de slide types
- decidir onde usar agenda e separadores

## 12.2 No Composer
Este guia deve ser usado para:
- validar se o slide escolhido é adequado à mensagem
- adaptar conteúdo ao template correto
- propor divisão de slide quando necessário

---

## 13) Nota final

A escolha correta do slide type é uma decisão de **comunicação**, não apenas de estética.

Se houver dúvida:
- priorizar clareza,
- escolher o template mais simples,
- e manter a narrativa fluida.