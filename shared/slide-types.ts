import type { SlideType, ComponentType } from "./schema";

export interface SlideTypeMeta {
  name: SlideType;
  label: string;
  category: "base" | "agenda" | "content_light" | "content_dark";
  variant: "light" | "dark" | "neutral";
  allowedComponents: ComponentType[];
  maxComponents: number;
  description: string;
}

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
    label: "Conteúdo Simples (Claro)",
    category: "content_light",
    variant: "light",
    allowedComponents: ["text_block", "image_block", "bullet_list", "tag"],
    maxComponents: 4,
    description: "Conteúdo simples com texto ou imagem - fundo claro",
  },
  light_two_columns: {
    name: "light_two_columns",
    label: "Duas Colunas (Claro)",
    category: "content_light",
    variant: "light",
    allowedComponents: ["text_block", "image_block", "bullet_list"],
    maxComponents: 4,
    description: "Conteúdo em duas colunas - fundo claro",
  },
  light_chart_text: {
    name: "light_chart_text",
    label: "Gráfico + Texto (Claro)",
    category: "content_light",
    variant: "light",
    allowedComponents: ["chart_block", "text_block", "bullet_list"],
    maxComponents: 3,
    description: "Gráfico com interpretação textual - fundo claro",
  },
  dark_title_text_or_image: {
    name: "dark_title_text_or_image",
    label: "Conteúdo Simples (Escuro)",
    category: "content_dark",
    variant: "dark",
    allowedComponents: ["text_block", "image_block", "bullet_list", "tag"],
    maxComponents: 4,
    description: "Conteúdo simples com texto ou imagem - fundo escuro",
  },
  dark_two_columns: {
    name: "dark_two_columns",
    label: "Duas Colunas (Escuro)",
    category: "content_dark",
    variant: "dark",
    allowedComponents: ["text_block", "image_block", "bullet_list"],
    maxComponents: 4,
    description: "Conteúdo em duas colunas - fundo escuro",
  },
  dark_chart_text: {
    name: "dark_chart_text",
    label: "Gráfico + Texto (Escuro)",
    category: "content_dark",
    variant: "dark",
    allowedComponents: ["chart_block", "text_block", "bullet_list"],
    maxComponents: 3,
    description: "Gráfico com interpretação textual - fundo escuro",
  },
};

export const SLIDE_TYPES = Object.keys(slideTypeRegistry) as SlideType[];
