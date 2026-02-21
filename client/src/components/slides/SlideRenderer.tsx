import type { Slide } from "@shared/schema";
import { CoverSlide } from "./CoverSlide";
import { ClosingSlide } from "./ClosingSlide";
import { SectionDividerSlide } from "./SectionDividerSlide";
import { AgendaSlide } from "./AgendaSlide";
import { ContentSlide } from "./ContentSlide";
import { TwoColumnsSlide } from "./TwoColumnsSlide";
import { ChartTextSlide } from "./ChartTextSlide";

interface SlideRendererProps {
  slide: Slide;
}

const SLIDE_TYPE_FALLBACKS: Record<string, { component: string; variant: "light" | "dark" }> = {
  agenda: { component: "agenda", variant: "light" },
  agenda_slide: { component: "agenda", variant: "light" },
  content: { component: "content", variant: "light" },
  content_light: { component: "content", variant: "light" },
  content_dark: { component: "content", variant: "dark" },
  title_text: { component: "content", variant: "light" },
  title_text_or_image: { component: "content", variant: "light" },
  two_columns: { component: "two_columns", variant: "light" },
  chart_text: { component: "chart_text", variant: "light" },
  divider: { component: "section_divider", variant: "dark" },
  section: { component: "section_divider", variant: "dark" },
  close: { component: "closing", variant: "dark" },
  end: { component: "closing", variant: "dark" },
};

function renderByFallback(slide: Slide, fallback: { component: string; variant: "light" | "dark" }) {
  switch (fallback.component) {
    case "agenda":
      return <AgendaSlide slide={slide} variant={fallback.variant} />;
    case "content":
      return <ContentSlide slide={slide} variant={fallback.variant} />;
    case "two_columns":
      return <TwoColumnsSlide slide={slide} variant={fallback.variant} />;
    case "chart_text":
      return <ChartTextSlide slide={slide} variant={fallback.variant} />;
    case "section_divider":
      return <SectionDividerSlide slide={slide} />;
    case "closing":
      return <ClosingSlide slide={slide} />;
    default:
      return <ContentSlide slide={slide} variant="light" />;
  }
}

export function SlideRenderer({ slide }: SlideRendererProps) {
  switch (slide.type) {
    case "cover":
      return <CoverSlide slide={slide} />;
    case "closing":
      return <ClosingSlide slide={slide} />;
    case "section_divider":
      return <SectionDividerSlide slide={slide} />;
    case "agenda_light":
      return <AgendaSlide slide={slide} variant="light" />;
    case "agenda_dark":
      return <AgendaSlide slide={slide} variant="dark" />;
    case "light_title_text_or_image":
      return <ContentSlide slide={slide} variant="light" />;
    case "dark_title_text_or_image":
      return <ContentSlide slide={slide} variant="dark" />;
    case "light_two_columns":
      return <TwoColumnsSlide slide={slide} variant="light" />;
    case "dark_two_columns":
      return <TwoColumnsSlide slide={slide} variant="dark" />;
    case "light_chart_text":
      return <ChartTextSlide slide={slide} variant="light" />;
    case "dark_chart_text":
      return <ChartTextSlide slide={slide} variant="dark" />;
    default: {
      const fallback = SLIDE_TYPE_FALLBACKS[slide.type];
      if (fallback) {
        return renderByFallback(slide, fallback);
      }
      return <ContentSlide slide={slide} variant="light" />;
    }
  }
}
