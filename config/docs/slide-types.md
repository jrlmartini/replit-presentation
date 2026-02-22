# Tipos de Slide — Referência Técnica

## Visão Geral

O sistema utiliza **15 tipos de slide canônicos** organizados em 5 categorias, com **16 layout variants** que definem a disposição dos componentes via **sistema de slots**.

Todos os tipos — incluindo os estruturais (base) — usam layout variants com slots obrigatórios. O tema visual é centralizado em `theme-conatus.ts`.

---

## Arquitetura: SlideType → LayoutVariant → Slots → Components

```
SlideType (15 tipos)
  └─ LayoutVariant (1..N por tipo)
       └─ Slots (1..N por variant)
            └─ Components (tipos permitidos + min/max)
```

Cada `SlideType` possui:
- `allowedLayouts`: lista de layout variants compatíveis
- `defaultLayout`: variant padrão se nenhum for especificado
- `allowedComponents`: lista global de tipos de componente permitidos
- `maxComponents`: limite máximo de componentes no slide

Cada `LayoutVariant` possui:
- `slots`: dicionário de slots com regras `{ allowedComponents, min?, max? }`

---

## Tipos de Slide por Categoria

### 1. Base (Estruturais)

| Tipo              | Label               | Variante | Background       | Layout Padrão               | Max Comp. |
|-------------------|----------------------|----------|------------------|-----------------------------|-----------|
| `cover`           | Capa                 | dark     | `bg-cover.png`   | `cover_standard`            | 4         |
| `closing`         | Encerramento         | dark     | `bg-closing.png` | `closing_standard`          | 4         |
| `section_divider` | Separador de Seção   | dark     | `bg-section.png` | `section_divider_standard`  | 3         |

**Componentes permitidos por tipo:**
- `cover`: text_block, image_block, tag
- `closing`: text_block, contact_block, image_block, tag
- `section_divider`: divider_label, text_block, tag

### 2. Agenda

| Tipo              | Label               | Variante | Background       | Layout Padrão      | Max Comp. |
|-------------------|----------------------|----------|------------------|--------------------|-----------|
| `agenda_light`    | Agenda (Claro)       | light    | nenhum           | `agenda_standard`  | 3         |
| `agenda_dark`     | Agenda (Escuro)      | dark     | `bg-dark.png`    | `agenda_standard`  | 3         |

**Componentes permitidos:** agenda_list, text_block, tag

### 3. Conteúdo (Content Layout)

| Tipo                    | Label              | Variante | Max Comp. | Layouts Permitidos                                                                                  |
|-------------------------|--------------------|----------|-----------|------------------------------------------------------------------------------------------------------|
| `light_content_layout`  | Conteúdo (Claro)   | light    | 8         | single_col, two_cols_50_50, two_cols_60_40, two_cols_40_60, three_cols_equal, three_cols_emphasis_left, three_cols_emphasis_center |
| `dark_content_layout`   | Conteúdo (Escuro)  | dark     | 8         | (mesmos acima)                                                                                       |

**Componentes permitidos:** text_block, bullet_list, image_block, tag

### 4. Ícones / Features

| Tipo                   | Label                   | Variante | Max Comp. | Layouts Permitidos                                                    |
|------------------------|--------------------------|----------|-----------|-----------------------------------------------------------------------|
| `light_icon_features`  | Ícones/Features (Claro)  | light    | 7         | icons_3_horizontal, icons_4_horizontal, icons_3_vertical_with_quote   |
| `dark_icon_features`   | Ícones/Features (Escuro) | dark     | 7         | (mesmos acima)                                                        |

**Componentes permitidos:** text_block, tag, icon_feature_item

### 5. Gráficos

| Tipo               | Label                   | Variante | Max Comp. | Layouts Permitidos                           |
|--------------------|--------------------------|----------|-----------|----------------------------------------------|
| `light_chart_text` | Gráfico + Texto (Claro)  | light    | 5         | chart_left_text_right, text_left_chart_right  |
| `dark_chart_text`  | Gráfico + Texto (Escuro) | dark     | 5         | (mesmos acima)                                |

**Componentes permitidos:** chart_block, text_block, bullet_list, tag

### 6. Tipos Legados (Backward Compatibility)

Estes tipos continuam funcionando mas são mapeados automaticamente para tipos semânticos via `LEGACY_TYPE_MAP`:

| Tipo Legado                     | Mapeado Para                           |
|---------------------------------|-----------------------------------------|
| `light_title_text_or_image`     | `light_content_layout` + `single_col`   |
| `dark_title_text_or_image`      | `dark_content_layout` + `single_col`    |
| `light_two_columns`             | `light_content_layout` + `two_cols_50_50` |
| `dark_two_columns`              | `dark_content_layout` + `two_cols_50_50`  |

---

## Layout Variants Completo (16 variantes)

### Base Types (4 variants dedicados)

#### `cover_standard`
| Slot        | Componentes Permitidos   | Min | Max |
|-------------|--------------------------|-----|-----|
| `header`    | text_block, tag          | 1   | 2   |
| `hero_media`| image_block              | —   | 1   |
| `meta`      | text_block, tag          | —   | 1   |

#### `closing_standard`
| Slot           | Componentes Permitidos       | Min | Max |
|----------------|------------------------------|-----|-----|
| `header`       | text_block, tag              | 1   | 2   |
| `main`         | text_block, image_block      | —   | 1   |
| `contact_area` | contact_block, text_block    | 1   | 1   |

#### `section_divider_standard`
| Slot      | Componentes Permitidos       | Min | Max |
|-----------|------------------------------|-----|-----|
| `divider` | divider_label, text_block    | 1   | 1   |
| `subtext` | text_block, tag              | —   | 2   |

#### `agenda_standard`
| Slot           | Componentes Permitidos | Min | Max |
|----------------|------------------------|-----|-----|
| `header`       | text_block, tag        | 1   | 2   |
| `agenda_items` | agenda_list            | 1   | 1   |

### Content Layouts (7 variants)

#### `single_col`
| Slot     | Componentes Permitidos                    | Min | Max |
|----------|-------------------------------------------|-----|-----|
| `header` | text_block, tag                           | 1   | 2   |
| `main`   | text_block, bullet_list, image_block, tag | 1   | 4   |

#### `two_cols_50_50`
| Slot     | Componentes Permitidos                    | Min | Max |
|----------|-------------------------------------------|-----|-----|
| `header` | text_block, tag                           | 1   | 2   |
| `col_1`  | text_block, bullet_list, image_block, tag | 1   | 2   |
| `col_2`  | text_block, bullet_list, image_block, tag | 1   | 2   |

#### `two_cols_60_40`
| Slot     | Componentes Permitidos                    | Min | Max |
|----------|-------------------------------------------|-----|-----|
| `header` | text_block, tag                           | 1   | 2   |
| `col_1`  | text_block, bullet_list, image_block, tag | 1   | 3   |
| `col_2`  | text_block, bullet_list, image_block, tag | 1   | 2   |

#### `two_cols_40_60`
| Slot     | Componentes Permitidos                    | Min | Max |
|----------|-------------------------------------------|-----|-----|
| `header` | text_block, tag                           | 1   | 2   |
| `col_1`  | text_block, bullet_list, image_block, tag | 1   | 2   |
| `col_2`  | text_block, bullet_list, image_block, tag | 1   | 3   |

#### `three_cols_equal`
| Slot     | Componentes Permitidos                    | Min | Max |
|----------|-------------------------------------------|-----|-----|
| `header` | text_block, tag                           | 1   | 2   |
| `col_1`  | text_block, bullet_list, image_block, tag | 1   | 2   |
| `col_2`  | text_block, bullet_list, image_block, tag | 1   | 2   |
| `col_3`  | text_block, bullet_list, image_block, tag | 1   | 2   |

#### `three_cols_emphasis_left`
| Slot     | Componentes Permitidos                    | Min | Max |
|----------|-------------------------------------------|-----|-----|
| `header` | text_block, tag                           | 1   | 2   |
| `col_1`  | text_block, bullet_list, image_block, tag | 1   | 3   |
| `col_2`  | text_block, bullet_list, image_block, tag | 1   | 2   |
| `col_3`  | text_block, bullet_list, image_block, tag | 1   | 2   |

#### `three_cols_emphasis_center`
| Slot     | Componentes Permitidos                    | Min | Max |
|----------|-------------------------------------------|-----|-----|
| `header` | text_block, tag                           | 1   | 2   |
| `col_1`  | text_block, bullet_list, image_block, tag | 1   | 2   |
| `col_2`  | text_block, bullet_list, image_block, tag | 1   | 3   |
| `col_3`  | text_block, bullet_list, image_block, tag | 1   | 2   |

### Icon Layouts (3 variants)

#### `icons_3_horizontal`
| Slot         | Componentes Permitidos | Min | Max |
|--------------|------------------------|-----|-----|
| `header`     | text_block, tag        | 1   | 2   |
| `icon_items` | icon_feature_item      | 3   | 3   |

#### `icons_4_horizontal`
| Slot         | Componentes Permitidos | Min | Max |
|--------------|------------------------|-----|-----|
| `header`     | text_block, tag        | 1   | 2   |
| `icon_items` | icon_feature_item      | 4   | 4   |

#### `icons_3_vertical_with_quote`
| Slot               | Componentes Permitidos | Min | Max |
|--------------------|------------------------|-----|-----|
| `header`           | text_block, tag        | 1   | 2   |
| `left_emphasis`    | text_block             | 1   | 1   |
| `right_icon_items` | icon_feature_item      | 3   | 3   |

### Chart Layouts (2 variants)

#### `chart_left_text_right`
| Slot         | Componentes Permitidos    | Min | Max |
|--------------|---------------------------|-----|-----|
| `header`     | text_block, tag           | 1   | 2   |
| `chart_area` | chart_block               | 1   | 1   |
| `text_area`  | text_block, bullet_list   | 1   | 2   |

#### `text_left_chart_right`
| Slot         | Componentes Permitidos    | Min | Max |
|--------------|---------------------------|-----|-----|
| `header`     | text_block, tag           | 1   | 2   |
| `text_area`  | text_block, bullet_list   | 1   | 2   |
| `chart_area` | chart_block               | 1   | 1   |

---

## Slots — Referência Completa (18 slots)

| Slot              | Usado em                                     | Propósito                                   |
|-------------------|----------------------------------------------|---------------------------------------------|
| `header`          | Quase todos os layouts                       | Título, subtítulo, tags do slide            |
| `main`            | single_col, closing_standard                 | Área principal de conteúdo                  |
| `hero_media`      | cover_standard                               | Imagem/logo de destaque na capa             |
| `meta`            | cover_standard                               | Metadados (data, versão, etc.)              |
| `contact_area`    | closing_standard                             | Bloco de informações de contato             |
| `divider`         | section_divider_standard                     | Label/texto do divisor de seção             |
| `subtext`         | section_divider_standard                     | Texto complementar abaixo do divisor        |
| `agenda_items`    | agenda_standard                              | Lista de itens da agenda                    |
| `col_1`           | two_cols_*, three_cols_*                     | Primeira coluna                             |
| `col_2`           | two_cols_*, three_cols_*                     | Segunda coluna                              |
| `col_3`           | three_cols_*                                 | Terceira coluna                             |
| `icon_items`      | icons_3_horizontal, icons_4_horizontal       | Grid de ícones/features                     |
| `left_emphasis`   | icons_3_vertical_with_quote                  | Texto de destaque à esquerda                |
| `right_icon_items`| icons_3_vertical_with_quote                  | Ícones à direita do destaque                |
| `chart_area`      | chart_left_text_right, text_left_chart_right | Área do gráfico                             |
| `text_area`       | chart_left_text_right, text_left_chart_right | Texto interpretativo ao lado do gráfico     |
| `left`            | (legado) TwoColumnsSlide                     | Coluna esquerda (backward compat)           |
| `right`           | (legado) TwoColumnsSlide                     | Coluna direita (backward compat)            |

---

## Componentes Disponíveis (9 tipos)

| ComponentType       | Label              | Conteúdo                                          | Uso                                    |
|---------------------|--------------------|----------------------------------------------------|----------------------------------------|
| `text_block`        | Bloco de Texto     | `string`                                           | Parágrafos, descrições                 |
| `bullet_list`       | Lista              | `string[]`                                         | Tópicos, itens                         |
| `image_block`       | Imagem             | `{ src: string, alt: string }`                     | Fotos, diagramas, ilustrações          |
| `agenda_list`       | Lista de Agenda    | `{ label: string, description?: string }[]`        | Índice da apresentação                 |
| `chart_block`       | Gráfico            | `{ title: string, type: string, data: [...] }`     | Gráficos de dados                      |
| `contact_block`     | Contato            | `{ name, email?, phone?, website? }`               | Informações de contato                 |
| `tag`               | Tag/Rótulo         | `string`                                           | Labels, categorias, badges             |
| `divider_label`     | Label Divisor      | `string`                                           | Rótulo de separador de seção           |
| `icon_feature_item` | Item de Feature    | `{ iconName, iconSrc?, title, text }`              | Ícones com título e descrição          |

---

## Mapeamento Background → Tipo de Slide

| Arquivo              | Slides que usam                                                                 |
|----------------------|---------------------------------------------------------------------------------|
| `bg-cover.png`       | `cover`                                                                          |
| `bg-closing.png`     | `closing`                                                                        |
| `bg-section.png`     | `section_divider`                                                                |
| `bg-dark.png`        | `agenda_dark`, `dark_content_layout`, `dark_chart_text`, `dark_icon_features`    |
| `bg-light.png`       | `light_content_layout` (e tipos legados light)                                   |

---

## Regras de Composição

1. Todo deck começa com `cover` e termina com `closing`
2. `section_divider` marca transições entre blocos temáticos
3. `agenda_light` ou `agenda_dark` aparece logo após o cover (se habilitado)
4. Slides de conteúdo alternam entre light/dark conforme briefing
5. Máximo de componentes por slide varia de 3 a 8 conforme o tipo
6. Cada componente deve ter um `slot` atribuído conforme o layout variant
7. Componentes sem `slot` ainda são suportados por backward compatibility
8. Novos slides gerados pelo LLM sempre usam slots

---

## Backward Compatibility

### Estratégia
- **Tipos legados** (`light_title_text_or_image`, `dark_title_text_or_image`, `light_two_columns`, `dark_two_columns`) são mapeados para tipos semânticos via `LEGACY_TYPE_MAP`
- **Slides sem slots**: Templates base detectam `hasSlots` e fazem fallback para leitura direta de `slide.title`, `slide.subtitle` e componentes sem slot
- **Função `resolveSlideRendering()`**: Centraliza resolução de tipo + layout com fallback automático

### Fluxo de Resolução
```
1. Verifica se tipo é legado → mapeia para tipo semântico + layout
2. Se não legado → usa tipo direto + layout do slide (ou defaultLayout)
3. Template renderiza via slots se presentes, fallback se não
```

---

## Tabela de Recomendação: Situação → SlideType + Layout

| Situação de Conteúdo             | SlideType Recomendado     | LayoutVariant Recomendado       |
|----------------------------------|----------------------------|---------------------------------|
| Abertura da apresentação         | `cover`                    | `cover_standard`                |
| Encerramento com contato         | `closing`                  | `closing_standard`              |
| Transição entre seções           | `section_divider`          | `section_divider_standard`      |
| Índice/agenda da apresentação    | `agenda_light/dark`        | `agenda_standard`               |
| Texto simples ou texto + imagem  | `light/dark_content_layout`| `single_col`                    |
| Comparação lado a lado           | `light/dark_content_layout`| `two_cols_50_50`                |
| Texto principal + complemento    | `light/dark_content_layout`| `two_cols_60_40`                |
| Complemento + texto principal    | `light/dark_content_layout`| `two_cols_40_60`                |
| 3 tópicos equivalentes           | `light/dark_content_layout`| `three_cols_equal`              |
| 1 tópico principal + 2 menores   | `light/dark_content_layout`| `three_cols_emphasis_left`      |
| 2 menores + 1 central destaque   | `light/dark_content_layout`| `three_cols_emphasis_center`    |
| 3 benefícios/features            | `light/dark_icon_features` | `icons_3_horizontal`            |
| 4 benefícios/features            | `light/dark_icon_features` | `icons_4_horizontal`            |
| Citação + 3 features             | `light/dark_icon_features` | `icons_3_vertical_with_quote`   |
| Dados + interpretação            | `light/dark_chart_text`    | `chart_left_text_right`         |
| Interpretação + dados            | `light/dark_chart_text`    | `text_left_chart_right`         |

---

## Arquivos de Referência

| Arquivo                   | Conteúdo                                              |
|---------------------------|-------------------------------------------------------|
| `shared/schema.ts`        | Enums (slideTypeEnum, layoutVariantEnum, slotEnum, componentTypeEnum), tipos Zod |
| `shared/slide-types.ts`   | layoutVariantRegistry (16), slideTypeRegistry (15), LEGACY_TYPE_MAP, resolveSlideRendering() |
| `shared/theme-conatus.ts` | Tokens visuais (cores, fontes, espaçamento, columnProportions, iconLayout) |
| `server/llm-pipeline.ts`  | Pipeline de geração com tabelas de recomendação e documentação de slots |
