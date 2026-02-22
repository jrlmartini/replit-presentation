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

  const headerComps = slide.components?.filter(c => c.slot === "header") || [];
  const agendaItemsComps = slide.components?.filter(c => c.slot === "agenda_items") || [];

  const hasSlots = headerComps.length > 0 || agendaItemsComps.length > 0;

  const title = hasSlots
    ? (headerComps.find(c => c.componentType === "text_block")?.content as string || slide.title || "Agenda")
    : (slide.title || "Agenda");

  const headerTag = hasSlots
    ? headerComps.find(c => c.componentType === "tag")
    : slide.components?.find(c => c.componentType === "tag");

  const agendaComp = hasSlots
    ? agendaItemsComps.find(c => c.componentType === "agenda_list")
    : slide.components?.find(c => c.componentType === "agenda_list");

  const items = Array.isArray(agendaComp?.content) ? agendaComp.content : [];

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        backgroundImage: `url(${isDark ? t.backgrounds.dark.image : t.backgrounds.light.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      <div className="relative z-10 flex flex-col h-full" style={{ padding: "3.5rem 5rem" }}>
        {headerTag && (
          <div
            className="mb-4 anim-fade-up anim-delay-0"
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: t.slideLayout.tag.paddingSm,
              borderRadius: t.radius.full,
              backgroundColor: isDark ? t.overlay.darkTagBg : t.overlay.lightTagBg,
              border: `1px solid ${isDark ? t.overlay.darkTagBorder : t.overlay.lightTagBorder}`,
              color: isDark ? t.colors.primaryLight : t.colors.primary,
              fontSize: t.slideLayout.tag.fontSize,
              fontWeight: t.slideLayout.tag.fontWeight,
              letterSpacing: t.slideLayout.tag.letterSpacing,
              textTransform: "uppercase",
            }}
          >
            {String(headerTag.content)}
          </div>
        )}
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
