import type { Slide } from "@shared/schema";
import { themeConatus } from "@shared/theme-conatus";

const t = themeConatus;
const layout = t.slideLayout.section;

interface SectionDividerSlideProps {
  slide: Slide;
}

export function SectionDividerSlide({ slide }: SectionDividerSlideProps) {
  const dividerComps = slide.components?.filter(c => c.slot === "divider") || [];
  const subtextComps = slide.components?.filter(c => c.slot === "subtext") || [];

  const hasSlots = dividerComps.length > 0 || subtextComps.length > 0;

  const title = hasSlots
    ? (dividerComps.find(c => c.componentType === "divider_label")?.content as string
      || dividerComps.find(c => c.componentType === "text_block")?.content as string
      || slide.title || "[TÍTULO DA SEÇÃO]")
    : (slide.title || "[TÍTULO DA SEÇÃO]");

  const subtitle = hasSlots
    ? (subtextComps.find(c => c.componentType === "text_block")?.content as string || slide.subtitle || "")
    : (slide.subtitle || "");

  const subtextTag = hasSlots
    ? subtextComps.find(c => c.componentType === "tag")
    : null;

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        backgroundImage: `url(${t.backgrounds.section.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      <div className="relative z-10 flex flex-col justify-center h-full" style={{ padding: t.spacing.slideLarge.padding }}>
        <div
          className="anim-line-grow anim-delay-1"
          style={{
            width: layout.lineWidth,
            height: layout.lineHeight,
            backgroundColor: t.colors.primaryLight,
            marginBottom: "2.5cqw",
          }}
        />
        {subtextTag && (
          <div
            className="anim-fade-up anim-delay-1"
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: t.slideLayout.tag.paddingSm,
              borderRadius: t.radius.full,
              backgroundColor: t.overlay.darkTagBg,
              border: `1px solid ${t.overlay.darkTagBorder}`,
              color: t.colors.primaryLight,
              fontSize: t.slideLayout.tag.fontSize,
              fontWeight: t.slideLayout.tag.fontWeight,
              letterSpacing: t.slideLayout.tag.letterSpacing,
              textTransform: "uppercase",
              marginBottom: "1.25cqw",
            }}
          >
            {String(subtextTag.content)}
          </div>
        )}
        <h2
          className="anim-cover-title anim-delay-2"
          style={{
            fontFamily: t.fonts.heading,
            fontSize: layout.titleSize,
            fontWeight: layout.titleWeight,
            color: "#ffffff",
            lineHeight: 1.15,
            maxWidth: layout.titleMaxWidth,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="anim-fade-up anim-delay-4"
            style={{
              fontSize: layout.subtitleSize,
              color: t.colors.dark.textSecondary,
              marginTop: "1.25cqw",
              maxWidth: layout.subtitleMaxWidth,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
