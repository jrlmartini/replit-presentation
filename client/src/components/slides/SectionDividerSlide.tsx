import type { Slide } from "@shared/schema";
import { themeConatus } from "@shared/theme-conatus";

const t = themeConatus;
const layout = t.slideLayout.section;

interface SectionDividerSlideProps {
  slide: Slide;
}

export function SectionDividerSlide({ slide }: SectionDividerSlideProps) {
  const title = slide.title || "[TÍTULO DA SEÇÃO]";
  const subtitle = slide.subtitle || "";

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        background: t.gradients.sectionBg,
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${t.backgrounds.section.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: t.backgrounds.section.opacity,
        }}
      />
      <div className="relative z-10 flex flex-col justify-center h-full" style={{ padding: t.spacing.slideLarge.padding }}>
        <div
          className="anim-line-grow anim-delay-1"
          style={{
            width: layout.lineWidth,
            height: layout.lineHeight,
            backgroundColor: t.colors.primaryLight,
            marginBottom: "2rem",
          }}
        />
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
              marginTop: "1rem",
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
