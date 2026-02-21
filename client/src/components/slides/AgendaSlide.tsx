import type { Slide } from "@shared/schema";
import { AgendaList } from "../blocks/AgendaList";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

const t = themeConatus;
const layout = t.slideLayout.agenda;

interface AgendaSlideProps {
  slide: Slide;
  variant: "light" | "dark";
}

export function AgendaSlide({ slide, variant }: AgendaSlideProps) {
  const isDark = variant === "dark";
  const vc = getVariantColors(variant);
  const title = slide.title || "Agenda";
  const agendaComp = slide.components?.find(c => c.componentType === "agenda_list");
  const items = Array.isArray(agendaComp?.content) ? agendaComp.content : [];

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        background: vc.gradient,
        overflow: "hidden",
      }}
    >
      {isDark && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${t.backgrounds.darkStrong.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: t.backgrounds.darkStrong.opacity,
          }}
        />
      )}
      <div className="relative z-10 flex flex-col h-full" style={{ padding: "3.5rem 5rem" }}>
        <div className="flex items-center gap-4 mb-8 anim-fade-up anim-delay-1">
          <div
            className="anim-line-grow anim-delay-1"
            style={{
              width: layout.lineWidth,
              height: layout.lineHeight,
              backgroundColor: vc.accent,
            }}
          />
          <h2
            style={{
              fontFamily: t.fonts.heading,
              fontSize: layout.titleSize,
              fontWeight: layout.titleWeight,
              color: vc.text,
            }}
          >
            {title}
          </h2>
        </div>
        <div className="flex-1 flex items-center anim-fade-up anim-delay-3">
          <AgendaList items={items as string[]} variant={variant} />
        </div>
      </div>
    </div>
  );
}
