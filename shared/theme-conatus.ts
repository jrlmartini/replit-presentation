export const themeConatus = {
  themeId: "conatus-v1",
  name: "Conatus Ambiental",

  colors: {
    primary: "#1a7a5c",
    primaryDark: "#145e47",
    primaryLight: "#22a87e",
    accent: "#0d3b2e",
    accentLight: "#1a5c47",

    dark: {
      bg: "#0f1f1a",
      bgAlt: "#142b23",
      surface: "#1a3a2e",
      text: "#e8f5f0",
      textSecondary: "#a8cfc0",
      textMuted: "#6b9e8c",
      border: "#2a5a48",
    },
    light: {
      bg: "#f5faf8",
      bgAlt: "#edf6f2",
      surface: "#ffffff",
      text: "#0f2a20",
      textSecondary: "#3a6b55",
      textMuted: "#6b9e8c",
      border: "#c8e0d5",
    },

    chart: ["#1a7a5c", "#2aa88e", "#0d5c45", "#45c9a8", "#0a3d2e"],
  },

  fonts: {
    heading: "'Plus Jakarta Sans', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },

  typography: {
    title: { size: "2.5rem", weight: 700, lineHeight: 1.2 },
    subtitle: { size: "1.25rem", weight: 400, lineHeight: 1.4 },
    heading: { size: "1.75rem", weight: 600, lineHeight: 1.3 },
    body: { size: "1rem", weight: 400, lineHeight: 1.6 },
    caption: { size: "0.875rem", weight: 400, lineHeight: 1.4 },
    small: { size: "0.75rem", weight: 400, lineHeight: 1.4 },
  },

  spacing: {
    slide: { padding: "3rem 4.5rem" },
    slideLarge: { padding: "4rem 5rem" },
    section: { gap: "2rem" },
    content: { gap: "1.5rem" },
    bullet: { gap: "0.75rem" },
  },

  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "2rem",
  },

  gradients: {
    darkBg: "linear-gradient(135deg, #0f1f1a 0%, #142b23 50%, #1a3a2e 100%)",
    lightBg: "linear-gradient(135deg, #f5faf8 0%, #edf6f2 100%)",
    coverBg: "linear-gradient(135deg, #0a1f17 0%, #0f2d22 30%, #143d2e 60%, #1a5040 100%)",
    sectionBg: "linear-gradient(135deg, #0d2e22 0%, #145e47 50%, #1a7a5c 100%)",
    closingBg: "linear-gradient(135deg, #0a1f17 0%, #0f2d22 40%, #143d2e 100%)",
    progressBar: "linear-gradient(90deg, #22a87e, #1a7a5c, #0d5c45)",
    progressBarSimple: "linear-gradient(90deg, #1a7a5c, #22a87e)",
  },

  backgrounds: {
    cover: { image: "/images/bg-cover.png", opacity: 0.35 },
    dark: { image: "/images/bg-dark.png", opacity: 0.15 },
    darkStrong: { image: "/images/bg-dark.png", opacity: 0.2 },
    light: { image: "/images/bg-light.png", opacity: 0.1 },
    section: { image: "/images/bg-section.png", opacity: 0.25 },
    closing: { image: "/images/bg-closing.png", opacity: 0.3 },
  },

  overlay: {
    darkPlaceholder: "rgba(255,255,255,0.05)",
    lightPlaceholder: "rgba(0,0,0,0.04)",
    darkPlaceholderBorder: "rgba(255,255,255,0.15)",
    lightPlaceholderBorder: "rgba(0,0,0,0.12)",
    darkSurface: "rgba(255,255,255,0.03)",
    lightSurface: "rgba(0,0,0,0.02)",
    darkSurfaceBorder: "rgba(255,255,255,0.06)",
    lightSurfaceBorder: "rgba(0,0,0,0.06)",
    darkTagBg: "rgba(34,168,126,0.15)",
    lightTagBg: "rgba(26,122,92,0.1)",
    darkTagBorder: "rgba(34,168,126,0.3)",
    lightTagBorder: "rgba(26,122,92,0.2)",
    darkAgendaBg: "rgba(34, 168, 126, 0.2)",
    lightAgendaBg: "rgba(26, 122, 92, 0.1)",
    darkGrid: "rgba(255,255,255,0.08)",
    lightGrid: "rgba(0,0,0,0.08)",
    darkDashedBorder: "rgba(255,255,255,0.15)",
    lightDashedBorder: "rgba(0,0,0,0.12)",
  },

  slideLayout: {
    cover: {
      titleSize: "3rem",
      titleWeight: 800,
      titleMaxWidth: "70%",
      subtitleSize: "1.25rem",
      subtitleMaxWidth: "60%",
      brandSize: "0.8125rem",
      lineWidth: "2rem",
      lineHeight: "2px",
    },
    section: {
      titleSize: "2.75rem",
      titleWeight: 800,
      titleMaxWidth: "70%",
      subtitleSize: "1.125rem",
      subtitleMaxWidth: "55%",
      lineWidth: "3rem",
      lineHeight: "3px",
    },
    closing: {
      titleSize: "3rem",
      titleWeight: 800,
      subtitleSize: "1.125rem",
      subtitleMaxWidth: "60%",
      dividerWidth: "4rem",
      dividerHeight: "2px",
    },
    agenda: {
      titleSize: "2rem",
      titleWeight: 700,
      lineWidth: "2.5rem",
      lineHeight: "3px",
      itemSize: "1.125rem",
      numberSize: "2.5rem",
    },
    tag: {
      paddingSm: "0.25rem 0.75rem",
      paddingMd: "0.375rem 1rem",
      fontSize: "0.6875rem",
      fontSizeMd: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.05em",
    },
  },
} as const;

export type ThemeConatus = typeof themeConatus;

export function getVariantColors(variant: "light" | "dark") {
  const t = themeConatus;
  const isDark = variant === "dark";
  return {
    text: isDark ? t.colors.dark.text : t.colors.light.text,
    textSecondary: isDark ? t.colors.dark.textSecondary : t.colors.light.textSecondary,
    textMuted: isDark ? t.colors.dark.textMuted : t.colors.light.textMuted,
    bg: isDark ? t.colors.dark.bg : t.colors.light.bg,
    surface: isDark ? t.colors.dark.surface : t.colors.light.surface,
    border: isDark ? t.colors.dark.border : t.colors.light.border,
    accent: isDark ? t.colors.primaryLight : t.colors.primary,
    gradient: isDark ? t.gradients.darkBg : t.gradients.lightBg,
    bgImage: isDark ? t.backgrounds.dark : t.backgrounds.light,
    placeholderBg: isDark ? t.overlay.darkPlaceholder : t.overlay.lightPlaceholder,
    placeholderBorder: isDark ? t.overlay.darkPlaceholderBorder : t.overlay.lightPlaceholderBorder,
    surfaceOverlay: isDark ? t.overlay.darkSurface : t.overlay.lightSurface,
    surfaceBorder: isDark ? t.overlay.darkSurfaceBorder : t.overlay.lightSurfaceBorder,
    tagBg: isDark ? t.overlay.darkTagBg : t.overlay.lightTagBg,
    tagBorder: isDark ? t.overlay.darkTagBorder : t.overlay.lightTagBorder,
    agendaBg: isDark ? t.overlay.darkAgendaBg : t.overlay.lightAgendaBg,
    gridColor: isDark ? t.overlay.darkGrid : t.overlay.lightGrid,
  };
}
