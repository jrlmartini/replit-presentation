# Design System — Conatus Ambiental

## Identidade Visual

**Tema**: `conatus-v1`
**Marca**: Conatus Ambiental
**Formato**: 16:9 (widescreen)
**Idioma**: pt-BR

---

## Paleta de Cores

### Cores Primárias
| Token            | Hex       | Uso                                     |
|------------------|-----------|------------------------------------------|
| `primary`        | `#1a7a5c` | Cor principal, botões, destaques         |
| `primaryDark`    | `#145e47` | Hover, bordas ativas                     |
| `primaryLight`   | `#22a87e` | Acentos, ícones, indicadores de progresso|
| `accent`         | `#0d3b2e` | Backgrounds profundos, badges            |
| `accentLight`    | `#1a5c47` | Superfícies de destaque                  |

### Modo Escuro (Slides dark)
| Token            | Hex       | Uso                                      |
|------------------|-----------|-------------------------------------------|
| `dark.bg`        | `#0f1f1a` | Fundo principal                           |
| `dark.bgAlt`     | `#142b23` | Fundo alternativo (gradiente)             |
| `dark.surface`   | `#1a3a2e` | Cards, superfícies elevadas               |
| `dark.text`      | `#e8f5f0` | Texto principal                           |
| `dark.textSecondary` | `#a8cfc0` | Texto secundário, subtítulos          |
| `dark.textMuted` | `#6b9e8c` | Texto muted, captions                    |
| `dark.border`    | `#2a5a48` | Bordas, divisores                         |

### Modo Claro (Slides light)
| Token            | Hex       | Uso                                      |
|------------------|-----------|-------------------------------------------|
| `light.bg`       | `#f5faf8` | Fundo principal                           |
| `light.bgAlt`    | `#edf6f2` | Fundo alternativo (gradiente)             |
| `light.surface`  | `#ffffff` | Cards, superfícies                        |
| `light.text`     | `#0f2a20` | Texto principal                           |
| `light.textSecondary` | `#3a6b55` | Texto secundário                     |
| `light.textMuted`| `#6b9e8c` | Texto muted                              |
| `light.border`   | `#c8e0d5` | Bordas                                   |

### Cores para Gráficos
| Índice | Hex       |
|--------|-----------|
| 0      | `#1a7a5c` |
| 1      | `#2aa88e` |
| 2      | `#0d5c45` |
| 3      | `#45c9a8` |
| 4      | `#0a3d2e` |

---

## Tipografia

| Token     | Família                             | Uso                        |
|-----------|-------------------------------------|----------------------------|
| `heading` | Plus Jakarta Sans                   | Títulos, headings          |
| `body`    | Inter                               | Corpo de texto, parágrafos |
| `mono`    | JetBrains Mono                      | Código, contadores         |

### Escalas Tipográficas
| Token      | Tamanho   | Peso | Line-Height | Uso                    |
|------------|-----------|------|-------------|------------------------|
| `title`    | 2.5rem    | 700  | 1.2         | Título do slide        |
| `subtitle` | 1.25rem   | 400  | 1.4         | Subtítulo              |
| `heading`  | 1.75rem   | 600  | 1.3         | Headings de seção      |
| `body`     | 1rem      | 400  | 1.6         | Texto corrido          |
| `caption`  | 0.875rem  | 400  | 1.4         | Legendas, notas        |
| `small`    | 0.75rem   | 400  | 1.4         | Labels, badges, footer |

---

## Espaçamento

| Token             | Valor          | Uso                           |
|-------------------|----------------|-------------------------------|
| `slide.padding`   | 3rem 4rem      | Padding interno dos slides    |
| `section.gap`     | 2rem           | Gap entre seções              |
| `content.gap`     | 1.5rem         | Gap entre componentes         |
| `bullet.gap`      | 0.75rem        | Gap entre itens de lista      |

---

## Border Radius

| Token | Valor     | Uso                     |
|-------|-----------|-------------------------|
| `sm`  | 0.375rem  | Badges, tags pequenas   |
| `md`  | 0.5rem    | Botões, inputs          |
| `lg`  | 0.75rem   | Cards, painéis          |
| `xl`  | 1rem      | Modais, containers      |

---

## Gradientes

### Fundo Escuro (slides dark)
```css
background: linear-gradient(135deg, #0f1f1a 0%, #142b23 50%, #1a3a2e 100%);
```

### Fundo Claro (slides light)
```css
background: linear-gradient(135deg, #f5faf8 0%, #edf6f2 50%, #ffffff 100%);
```

### Barra de Progresso
```css
background: linear-gradient(90deg, #1a7a5c, #22a87e);
```

---

## Efeitos

- **Backdrop blur**: `blur(4px)` — botões de navegação sobre slides
- **Overlay escuro**: `rgba(0,0,0,0.5)` — botões flutuantes
- **Background image opacity**: `0.3` (dark) / `0.15` (light) — texturas de fundo
