export const themeConatus = {
  themeId: "conatus-v1",
  name: "Conatus Ambiental",

  colors: {
    primary: "#214059",
    primaryDark: "#03131e",
    primaryLight: "#8f9da7",
    accent: "#3b5e73",
    accentLight: "#c1cdd9",

    dark: {
      bg: "#03131e",
      bgAlt: "#214059",
      surface: "#3b5e73",
      text: "#f2f2f2",
      textSecondary: "#c1cdd9",
      textMuted: "#8f9da7",
      border: "#3b5e73",
    },
    light: {
      bg: "#f2f2f2",
      bgAlt: "#edf6f2",
      surface: "#c1cdd9",
      text: "#03131e",
      textSecondary: "#214059",
      textMuted: "#8f9da7",
      border: "#3b5e73",
    },

    chart: ["#275fc1", "#36b8ce", "#34d399", "#48e04c", "#c7d2fe"],
  },

  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },

  typography: {
    title: { size: "3.1cqw", weight: 700, lineHeight: 1.2 },
    subtitle: { size: "1.55cqw", weight: 400, lineHeight: 1.4 },
    heading: { size: "2.2cqw", weight: 600, lineHeight: 1.3 },
    body: { size: "1.25cqw", weight: 400, lineHeight: 1.6 },
    caption: { size: "1.1cqw", weight: 400, lineHeight: 1.4 },
    small: { size: "0.95cqw", weight: 400, lineHeight: 1.4 },
  },

  spacing: {
    slide: { padding: "3.75cqw 5.6cqw" },
    slideLarge: { padding: "5cqw 6.25cqw" },
    section: { gap: "2.5cqw" },
    content: { gap: "1.9cqw" },
    bullet: { gap: "0.95cqw" },
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

  columnProportions: {
    "two_cols_50_50": ["1fr", "1fr"],
    "two_cols_60_40": ["3fr", "2fr"],
    "two_cols_40_60": ["2fr", "3fr"],
    "three_cols_equal": ["1fr", "1fr", "1fr"],
    "three_cols_emphasis_left": ["2fr", "1fr", "1fr"],
    "three_cols_emphasis_center": ["1fr", "2fr", "1fr"],
  },

  iconLayout: {
    iconSize: "3.1cqw",
    iconContainerSize: "5cqw",
    iconGap: "2.5cqw",
    itemGap: "1.25cqw",
    titleSize: "1.25cqw",
    titleWeight: 600,
    textSize: "1.1cqw",
    quoteSize: "1.9cqw",
    quoteWeight: 500,
    quoteLineHeight: 1.4,
  },

  slideLayout: {
    cover: {
      titleSize: "3.75cqw",
      titleWeight: 800,
      titleMaxWidth: "70%",
      subtitleSize: "1.55cqw",
      subtitleMaxWidth: "60%",
      brandSize: "1cqw",
      lineWidth: "2.5cqw",
      lineHeight: "0.15cqw",
    },
    section: {
      titleSize: "3.45cqw",
      titleWeight: 800,
      titleMaxWidth: "70%",
      subtitleSize: "1.4cqw",
      subtitleMaxWidth: "55%",
      lineWidth: "3.75cqw",
      lineHeight: "0.25cqw",
    },
    closing: {
      titleSize: "3.75cqw",
      titleWeight: 800,
      subtitleSize: "1.4cqw",
      subtitleMaxWidth: "60%",
      dividerWidth: "5cqw",
      dividerHeight: "0.15cqw",
    },
    agenda: {
      titleSize: "2.5cqw",
      titleWeight: 700,
      lineWidth: "3.1cqw",
      lineHeight: "0.25cqw",
      itemSize: "1.4cqw",
      numberSize: "3.1cqw",
    },
    tag: {
      paddingSm: "0.3cqw 0.95cqw",
      paddingMd: "0.45cqw 1.25cqw",
      fontSize: "0.85cqw",
      fontSizeMd: "0.95cqw",
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
