import type { SlideType, ComponentType, LayoutVariant } from "./schema";

export interface SlotRule {
  allowedComponents: ComponentType[];
  min?: number;
  max?: number;
}

export interface LayoutVariantMeta {
  name: LayoutVariant;
  label: string;
  slots: Record<string, SlotRule>;
}

export interface SlideTypeMeta {
  name: SlideType;
  label: string;
  category: "base" | "agenda" | "content" | "icon_features" | "chart";
  variant: "light" | "dark" | "neutral";
  allowedComponents: ComponentType[];
  maxComponents: number;
  description: string;
  allowedLayouts?: LayoutVariant[];
  defaultLayout?: LayoutVariant;
}

export const layoutVariantRegistry: Record<string, LayoutVariantMeta> = {
  single_col: {
    name: "single_col",
    label: "Coluna Única",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      main: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 4 },
    },
  },
  two_cols_50_50: {
    name: "two_cols_50_50",
    label: "Duas Colunas (50/50)",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      col_1: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
      col_2: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
    },
  },
  two_cols_60_40: {
    name: "two_cols_60_40",
    label: "Duas Colunas (60/40)",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      col_1: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
      col_2: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
    },
  },
  two_cols_40_60: {
    name: "two_cols_40_60",
    label: "Duas Colunas (40/60)",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      col_1: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
      col_2: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
    },
  },
  three_cols_equal: {
    name: "three_cols_equal",
    label: "Três Colunas (iguais)",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      col_1: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
      col_2: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
      col_3: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
    },
  },
  three_cols_emphasis_left: {
    name: "three_cols_emphasis_left",
    label: "Três Colunas (ênfase esquerda 50/25/25)",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      col_1: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
      col_2: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
      col_3: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
    },
  },
  three_cols_emphasis_center: {
    name: "three_cols_emphasis_center",
    label: "Três Colunas (ênfase centro 25/50/25)",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      col_1: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
      col_2: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
      col_3: { allowedComponents: ["text_block", "bullet_list", "image_block", "tag"], max: 2 },
    },
  },
  icons_3_horizontal: {
    name: "icons_3_horizontal",
    label: "3 Ícones Horizontais",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      icon_items: { allowedComponents: ["icon_feature_item"], min: 3, max: 3 },
    },
  },
  icons_4_horizontal: {
    name: "icons_4_horizontal",
    label: "4 Ícones Horizontais",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      icon_items: { allowedComponents: ["icon_feature_item"], min: 4, max: 4 },
    },
  },
  icons_3_vertical_with_quote: {
    name: "icons_3_vertical_with_quote",
    label: "3 Ícones Verticais + Destaque",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      left_emphasis: { allowedComponents: ["text_block"], min: 1, max: 1 },
      right_icon_items: { allowedComponents: ["icon_feature_item"], min: 3, max: 3 },
    },
  },
  chart_left_text_right: {
    name: "chart_left_text_right",
    label: "Gráfico à Esquerda + Texto à Direita",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      chart_area: { allowedComponents: ["chart_block"], min: 1, max: 1 },
      text_area: { allowedComponents: ["text_block", "bullet_list"], min: 1, max: 3 },
    },
  },
  text_left_chart_right: {
    name: "text_left_chart_right",
    label: "Texto à Esquerda + Gráfico à Direita",
    slots: {
      header: { allowedComponents: ["text_block", "tag"], max: 2 },
      text_area: { allowedComponents: ["text_block", "bullet_list"], min: 1, max: 3 },
      chart_area: { allowedComponents: ["chart_block"], min: 1, max: 1 },
    },
  },
};

export const slideTypeRegistry: Record<SlideType, SlideTypeMeta> = {
  cover: {
    name: "cover",
    label: "Capa",
    category: "base",
    variant: "dark",
    allowedComponents: ["text_block", "image_block", "tag"],
    maxComponents: 4,
    description: "Slide de abertura da apresentação",
  },
  closing: {
    name: "closing",
    label: "Encerramento",
    category: "base",
    variant: "dark",
    allowedComponents: ["text_block", "contact_block", "image_block"],
    maxComponents: 4,
    description: "Slide de fechamento com contato",
  },
  section_divider: {
    name: "section_divider",
    label: "Separador de Seção",
    category: "base",
    variant: "dark",
    allowedComponents: ["text_block", "divider_label"],
    maxComponents: 2,
    description: "Marca transição de blocos temáticos",
  },
  agenda_light: {
    name: "agenda_light",
    label: "Agenda (Claro)",
    category: "agenda",
    variant: "light",
    allowedComponents: ["agenda_list", "text_block"],
    maxComponents: 2,
    description: "Visão geral da estrutura - fundo claro",
  },
  agenda_dark: {
    name: "agenda_dark",
    label: "Agenda (Escuro)",
    category: "agenda",
    variant: "dark",
    allowedComponents: ["agenda_list", "text_block"],
    maxComponents: 2,
    description: "Visão geral da estrutura - fundo escuro",
  },
  light_title_text_or_image: {
    name: "light_title_text_or_image",
    label: "Conteúdo Simples (Claro) [legado]",
    category: "content",
    variant: "light",
    allowedComponents: ["text_block", "image_block", "bullet_list", "tag"],
    maxComponents: 4,
    description: "Conteúdo simples - fundo claro. Mapeado para light_content_layout + single_col",
  },
  light_two_columns: {
    name: "light_two_columns",
    label: "Duas Colunas (Claro) [legado]",
    category: "content",
    variant: "light",
    allowedComponents: ["text_block", "image_block", "bullet_list"],
    maxComponents: 4,
    description: "Duas colunas - fundo claro. Mapeado para light_content_layout + two_cols_50_50",
  },
  light_chart_text: {
    name: "light_chart_text",
    label: "Gráfico + Texto (Claro)",
    category: "chart",
    variant: "light",
    allowedComponents: ["chart_block", "text_block", "bullet_list", "tag"],
    maxComponents: 4,
    description: "Gráfico com interpretação textual - fundo claro",
    allowedLayouts: ["chart_left_text_right", "text_left_chart_right"],
    defaultLayout: "chart_left_text_right",
  },
  dark_title_text_or_image: {
    name: "dark_title_text_or_image",
    label: "Conteúdo Simples (Escuro) [legado]",
    category: "content",
    variant: "dark",
    allowedComponents: ["text_block", "image_block", "bullet_list", "tag"],
    maxComponents: 4,
    description: "Conteúdo simples - fundo escuro. Mapeado para dark_content_layout + single_col",
  },
  dark_two_columns: {
    name: "dark_two_columns",
    label: "Duas Colunas (Escuro) [legado]",
    category: "content",
    variant: "dark",
    allowedComponents: ["text_block", "image_block", "bullet_list"],
    maxComponents: 4,
    description: "Duas colunas - fundo escuro. Mapeado para dark_content_layout + two_cols_50_50",
  },
  dark_chart_text: {
    name: "dark_chart_text",
    label: "Gráfico + Texto (Escuro)",
    category: "chart",
    variant: "dark",
    allowedComponents: ["chart_block", "text_block", "bullet_list", "tag"],
    maxComponents: 4,
    description: "Gráfico com interpretação textual - fundo escuro",
    allowedLayouts: ["chart_left_text_right", "text_left_chart_right"],
    defaultLayout: "chart_left_text_right",
  },
  light_content_layout: {
    name: "light_content_layout",
    label: "Conteúdo (Claro)",
    category: "content",
    variant: "light",
    allowedComponents: ["text_block", "image_block", "bullet_list", "tag"],
    maxComponents: 6,
    description: "Layout flexível de conteúdo - fundo claro. Suporta 1, 2 ou 3 colunas com proporções variáveis",
    allowedLayouts: [
      "single_col",
      "two_cols_50_50",
      "two_cols_60_40",
      "two_cols_40_60",
      "three_cols_equal",
      "three_cols_emphasis_left",
      "three_cols_emphasis_center",
    ],
    defaultLayout: "single_col",
  },
  dark_content_layout: {
    name: "dark_content_layout",
    label: "Conteúdo (Escuro)",
    category: "content",
    variant: "dark",
    allowedComponents: ["text_block", "image_block", "bullet_list", "tag"],
    maxComponents: 6,
    description: "Layout flexível de conteúdo - fundo escuro. Suporta 1, 2 ou 3 colunas com proporções variáveis",
    allowedLayouts: [
      "single_col",
      "two_cols_50_50",
      "two_cols_60_40",
      "two_cols_40_60",
      "three_cols_equal",
      "three_cols_emphasis_left",
      "three_cols_emphasis_center",
    ],
    defaultLayout: "single_col",
  },
  light_icon_features: {
    name: "light_icon_features",
    label: "Features com Ícones (Claro)",
    category: "icon_features",
    variant: "light",
    allowedComponents: ["text_block", "tag", "icon_feature_item"],
    maxComponents: 6,
    description: "Layout de features/benefícios com ícones - fundo claro",
    allowedLayouts: ["icons_3_horizontal", "icons_4_horizontal", "icons_3_vertical_with_quote"],
    defaultLayout: "icons_3_horizontal",
  },
  dark_icon_features: {
    name: "dark_icon_features",
    label: "Features com Ícones (Escuro)",
    category: "icon_features",
    variant: "dark",
    allowedComponents: ["text_block", "tag", "icon_feature_item"],
    maxComponents: 6,
    description: "Layout de features/benefícios com ícones - fundo escuro",
    allowedLayouts: ["icons_3_horizontal", "icons_4_horizontal", "icons_3_vertical_with_quote"],
    defaultLayout: "icons_3_horizontal",
  },
};

export const SLIDE_TYPES = Object.keys(slideTypeRegistry) as SlideType[];

export const LEGACY_TYPE_MAP: Record<string, { newType: SlideType; layout: string }> = {
  light_title_text_or_image: { newType: "light_content_layout", layout: "single_col" },
  dark_title_text_or_image: { newType: "dark_content_layout", layout: "single_col" },
  light_two_columns: { newType: "light_content_layout", layout: "two_cols_50_50" },
  dark_two_columns: { newType: "dark_content_layout", layout: "two_cols_50_50" },
};

export function resolveSlideRendering(slide: { type: string; layout?: { variant?: string } }) {
  const type = slide.type as SlideType;
  const layoutVariant = slide.layout?.variant;

  const legacy = LEGACY_TYPE_MAP[type];
  if (legacy && !layoutVariant) {
    return {
      semanticType: legacy.newType,
      layoutVariant: legacy.layout,
      variant: slideTypeRegistry[type]?.variant === "dark" ? "dark" as const : "light" as const,
    };
  }

  const meta = slideTypeRegistry[type];
  return {
    semanticType: type,
    layoutVariant: layoutVariant || meta?.defaultLayout || "single_col",
    variant: (meta?.variant === "dark" ? "dark" : "light") as "light" | "dark",
  };
}
