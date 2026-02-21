import type { Slide } from "@shared/schema";
import { AgendaList } from "../blocks/AgendaList";

interface AgendaSlideProps {
  slide: Slide;
  variant: "light" | "dark";
}

export function AgendaSlide({ slide, variant }: AgendaSlideProps) {
  const isDark = variant === "dark";
  const title = slide.title || "Agenda";
  const agendaComp = slide.components?.find(c => c.componentType === "agenda_list");
  const items = Array.isArray(agendaComp?.content) ? agendaComp.content : [];

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0f1f1a 0%, #142b23 50%, #1a3a2e 100%)"
          : "linear-gradient(135deg, #f5faf8 0%, #edf6f2 100%)",
        overflow: "hidden",
      }}
    >
      {isDark && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/bg-dark.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        />
      )}
      <div className="relative z-10 flex flex-col h-full" style={{ padding: "3.5rem 5rem" }}>
        <div className="flex items-center gap-4 mb-8 anim-fade-up anim-delay-1">
          <div
            className="anim-line-grow anim-delay-1"
            style={{
              width: "2.5rem",
              height: "3px",
              backgroundColor: isDark ? "#22a87e" : "#1a7a5c",
            }}
          />
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: isDark ? "#ffffff" : "#0f2a20",
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
