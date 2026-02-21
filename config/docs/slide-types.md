# Tipos de Slide — Referência

## Visão Geral

O sistema utiliza **11 tipos de slide canônicos** organizados em 4 categorias.
Cada tipo define quais componentes são permitidos e a variante de cor (light/dark).

---

## Categorias

### Base (Estruturais)
Slides obrigatórios ou estruturais da apresentação.

| Tipo              | Label               | Variante | Background         | Descrição                          |
|-------------------|----------------------|----------|--------------------|------------------------------------|
| `cover`           | Capa                 | dark     | `bg-cover.png`     | Slide de abertura da apresentação  |
| `closing`         | Encerramento         | dark     | `bg-closing.png`   | Slide de fechamento com contato    |
| `section_divider` | Separador de Seção   | dark     | `bg-section.png`   | Marca transição de blocos temáticos|

### Agenda
Slides de sumário/agenda.

| Tipo              | Label               | Variante | Background         | Descrição                          |
|-------------------|----------------------|----------|--------------------|------------------------------------|
| `agenda_light`    | Agenda (Claro)       | light    | nenhum             | Visão geral da estrutura - claro   |
| `agenda_dark`     | Agenda (Escuro)      | dark     | `bg-dark.png`      | Visão geral da estrutura - escuro  |

### Conteúdo Claro
Slides de conteúdo com fundo claro.

| Tipo                          | Label                     | Background      | Componentes permitidos                  | Max |
|-------------------------------|---------------------------|-----------------|------------------------------------------|-----|
| `light_title_text_or_image`   | Conteúdo Simples (Claro)  | `bg-light.png`  | text_block, image_block, bullet_list, tag| 4   |
| `light_two_columns`           | Duas Colunas (Claro)      | nenhum          | text_block, image_block, bullet_list     | 4   |
| `light_chart_text`            | Gráfico + Texto (Claro)   | nenhum          | chart_block, text_block, bullet_list     | 3   |

### Conteúdo Escuro
Slides de conteúdo com fundo escuro.

| Tipo                          | Label                     | Background      | Componentes permitidos                  | Max |
|-------------------------------|---------------------------|-----------------|------------------------------------------|-----|
| `dark_title_text_or_image`    | Conteúdo Simples (Escuro) | `bg-dark.png`   | text_block, image_block, bullet_list, tag| 4   |
| `dark_two_columns`            | Duas Colunas (Escuro)     | `bg-dark.png`   | text_block, image_block, bullet_list     | 4   |
| `dark_chart_text`             | Gráfico + Texto (Escuro)  | `bg-dark.png`   | chart_block, text_block, bullet_list     | 3   |

---

## Componentes Disponíveis

| ComponentType    | Label            | Tipos de Conteúdo                       | Uso                              |
|------------------|------------------|------------------------------------------|----------------------------------|
| `text_block`     | Bloco de Texto   | `string`                                | Parágrafos, descrições           |
| `bullet_list`    | Lista            | `string[]`                              | Tópicos, itens                   |
| `image_block`    | Imagem           | `{ src: string, alt: string }`          | Fotos, diagramas, ilustrações    |
| `agenda_list`    | Lista de Agenda  | `{ label: string, description?: string }[]` | Índice da apresentação       |
| `chart_block`    | Gráfico          | `{ title: string, type: string, data: [...] }` | Gráficos de dados          |
| `contact_block`  | Contato          | `{ name, email?, phone?, website? }`    | Informações de contato           |
| `tag`            | Tag/Rótulo       | `string`                                | Labels, categorias               |
| `divider_label`  | Label Divisor    | `string`                                | Rótulo de separador de seção     |

---

## Mapeamento Background → Tipo de Slide

| Arquivo              | Slides que usam                                                           |
|----------------------|----------------------------------------------------------------------------|
| `bg-cover.png`       | `cover`                                                                    |
| `bg-closing.png`     | `closing`                                                                  |
| `bg-section.png`     | `section_divider`                                                          |
| `bg-dark.png`        | `agenda_dark`, `dark_title_text_or_image`, `dark_two_columns`, `dark_chart_text`, `light_title_text_or_image` (versão dark) |
| `bg-light.png`       | `light_title_text_or_image` (versão light)                                 |

---

## Regras de Composição

1. Todo deck começa com `cover` e termina com `closing`
2. `section_divider` é usado para marcar transições temáticas
3. `agenda_light` ou `agenda_dark` aparecem logo após o cover (se habilitado)
4. Slides de conteúdo alternam entre light e dark conforme configuração do briefing
5. Máximo de componentes por slide varia de 2 a 4 conforme o tipo
