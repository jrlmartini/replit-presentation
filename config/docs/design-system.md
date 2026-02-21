# Design System — Conatus Ambiental

Este documento é um guia explicativo do sistema de design. Todos os valores concretos (cores, tamanhos, espaçamentos) estão definidos exclusivamente em `shared/theme-conatus.ts`. Aqui descrevemos o propósito e uso de cada token.

---

## Identidade Visual

**Tema**: `conatus-v1`
**Marca**: Conatus Ambiental
**Formato**: 16:9 (widescreen)
**Idioma**: pt-BR

---

## Paleta de Cores

### Cores Primárias
Definidas em `themeConatus.colors`:

| Token          | Propósito                                           |
|----------------|------------------------------------------------------|
| `primary`      | Cor principal da marca. Usada em botões, destaques, linhas decorativas em slides claros |
| `primaryDark`  | Variação mais escura. Usada em hover, bordas ativas  |
| `primaryLight` | Variação mais clara. Usada em acentos, ícones, indicadores e linhas em slides escuros |
| `accent`       | Tom profundo da marca. Usada em backgrounds profundos, badges |
| `accentLight`  | Tom intermediário. Usada em superfícies de destaque   |

### Modo Escuro (`colors.dark`)
Usado em slides dark (dark_title_text_or_image, dark_two_columns, dark_chart_text, cover, closing, section_divider):

| Token           | Propósito                                    |
|-----------------|-----------------------------------------------|
| `bg`            | Fundo principal dos slides escuros            |
| `bgAlt`         | Fundo alternativo, usado em gradientes        |
| `surface`       | Superfícies elevadas (cards, painéis internos)|
| `text`          | Texto principal (alta legibilidade)           |
| `textSecondary` | Subtítulos, texto de apoio                    |
| `textMuted`     | Captions, labels, texto de baixa ênfase       |
| `border`        | Bordas e divisores                            |

### Modo Claro (`colors.light`)
Usado em slides light (light_title_text_or_image, light_two_columns, light_chart_text, agenda_light):

| Token           | Propósito                                    |
|-----------------|-----------------------------------------------|
| `bg`            | Fundo principal dos slides claros             |
| `bgAlt`         | Fundo alternativo para gradientes             |
| `surface`       | Cards, superfícies (geralmente branco)        |
| `text`          | Texto principal                               |
| `textSecondary` | Texto de apoio                                |
| `textMuted`     | Captions, labels                              |
| `border`        | Bordas                                        |

### Cores para Gráficos (`colors.chart`)
Array de 5 cores progressivas usadas para barras, linhas e fatias de gráficos. A primeira é a cor primária; as demais são variações complementares.

---

## Tipografia

### Famílias (`fonts`)

| Token     | Propósito                                     |
|-----------|------------------------------------------------|
| `heading` | Títulos, headings, nomes. Tipografia display   |
| `body`    | Corpo de texto, parágrafos, listas. Legibilidade|
| `mono`    | Código, contadores, dados tabulares            |

### Escalas (`typography`)

| Token      | Propósito                                      |
|------------|--------------------------------------------------|
| `title`    | Título principal do slide                        |
| `subtitle` | Subtítulo abaixo do título                       |
| `heading`  | Heading de seção dentro do slide                 |
| `body`     | Texto corrido, parágrafos normais                |
| `caption`  | Legendas, notas de rodapé                        |
| `small`    | Labels, badges, texto muito pequeno              |

Cada escala define `size` (rem), `weight` e `lineHeight`.

---

## Espaçamento (`spacing`)

| Token           | Propósito                                      |
|-----------------|--------------------------------------------------|
| `slide.padding` | Padding padrão interno dos slides de conteúdo    |
| `slideLarge.padding` | Padding maior para slides especiais (cover, section, closing, agenda) |
| `section.gap`   | Espaço entre seções dentro do slide              |
| `content.gap`   | Espaço entre componentes de conteúdo             |
| `bullet.gap`    | Espaço entre itens de lista                      |

---

## Border Radius (`radius`)

| Token  | Propósito                              |
|--------|----------------------------------------|
| `sm`   | Badges, tags pequenas                  |
| `md`   | Botões, inputs, cards de conteúdo      |
| `lg`   | Painéis, containers                    |
| `xl`   | Modais, containers grandes             |
| `full` | Tags arredondadas, pills               |

---

## Gradientes (`gradients`)

| Token              | Propósito                                    |
|--------------------|-----------------------------------------------|
| `darkBg`           | Fundo padrão de slides escuros               |
| `lightBg`          | Fundo padrão de slides claros                |
| `coverBg`          | Fundo específico do slide de capa            |
| `sectionBg`        | Fundo do slide divisor de seção              |
| `closingBg`        | Fundo do slide de encerramento              |
| `progressBar`      | Barra decorativa superior/inferior (3 tons)  |
| `progressBarSimple`| Barra de progresso simplificada (2 tons)     |

---

## Backgrounds (`backgrounds`)

Cada slide type tem uma textura de fundo com opacidade controlada:

| Token       | Propósito                                  |
|-------------|---------------------------------------------|
| `cover`     | Textura do slide de capa                    |
| `dark`      | Textura padrão para slides escuros          |
| `darkStrong`| Textura escura com opacidade maior (agenda) |
| `light`     | Textura para slides claros                  |
| `section`   | Textura do slide divisor de seção           |
| `closing`   | Textura do slide de encerramento            |

---

## Overlays (`overlay`)

Valores de transparência para camadas sobrepostas:

| Token                  | Propósito                                    |
|------------------------|-----------------------------------------------|
| `darkPlaceholder`      | Fundo de placeholders em slides escuros       |
| `lightPlaceholder`     | Fundo de placeholders em slides claros        |
| `darkSurface`          | Fundo de painéis em two-columns dark          |
| `lightSurface`         | Fundo de painéis em two-columns light         |
| `darkTagBg/Border`     | Background e borda de tags em slides escuros  |
| `lightTagBg/Border`    | Background e borda de tags em slides claros   |
| `darkAgendaBg`         | Fundo dos círculos numerados da agenda dark   |
| `lightAgendaBg`        | Fundo dos círculos numerados da agenda light  |
| `darkGrid/lightGrid`   | Linhas de grade dos gráficos                  |

---

## Layout dos Slides (`slideLayout`)

Configurações específicas de cada tipo de slide:

### Cover
Slide de capa — título grande com subtítulo e barra de marca inferior.

### Section
Divisor de seção — título impactante com linha decorativa.

### Closing
Encerramento — título centralizado com contato e marca.

### Agenda
Lista numerada — título com linha decorativa e itens em círculos.

### Tag
Badges/labels — usados em vários tipos de slide como identificador de contexto.

---

## Helper: `getVariantColors(variant)`

Função utilitária exportada de `theme-conatus.ts` que retorna todas as cores contextuais baseadas no variant ("light" | "dark"). Use nos componentes para evitar repetição de lógica `isDark ? ... : ...`.

Retorna: `text`, `textSecondary`, `textMuted`, `accent`, `gradient`, `bgImage`, `placeholderBg`, `placeholderBorder`, `surfaceOverlay`, `surfaceBorder`, `tagBg`, `tagBorder`, `agendaBg`, `gridColor`.

---

## Como usar

1. Importe o tema: `import { themeConatus, getVariantColors } from "@shared/theme-conatus"`
2. Use `getVariantColors(variant)` para cores contextuais light/dark
3. Acesse tokens diretamente: `themeConatus.fonts.heading`, `themeConatus.spacing.slide.padding`
4. Nunca use valores HEX hardcoded nos componentes de slide
