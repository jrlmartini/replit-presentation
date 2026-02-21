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
    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
          <p>Tipo de slide não reconhecido: {slide.type}</p>
        </div>
      );
  }
}
