import type { Slide } from "@shared/schema";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

const t = themeConatus;
const layout = t.slideLayout.cover;
const vc = getVariantColors("dark");

interface CoverSlideProps {
  slide: Slide;
}

export function CoverSlide({ slide }: CoverSlideProps) {
  const title = slide.title || "[TÍTULO DA APRESENTAÇÃO]";
  const subtitle = slide.subtitle || "";
  const tag = slide.components?.find(c => c.componentType === "tag");

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        background: t.gradients.coverBg,
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${t.backgrounds.cover.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: t.backgrounds.cover.opacity,
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-1 anim-line-grow anim-delay-6" style={{ background: t.gradients.progressBar }} />
      <div className="relative z-10 flex flex-col justify-center h-full" style={{ padding: t.spacing.slideLarge.padding }}>
        {tag && (
          <div
            className="mb-6 anim-fade-up anim-delay-1"
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: t.slideLayout.tag.paddingMd,
              borderRadius: t.radius.full,
              backgroundColor: t.overlay.darkTagBg,
              border: `1px solid ${t.overlay.darkTagBorder}`,
              color: t.colors.primaryLight,
              fontSize: t.slideLayout.tag.fontSizeMd,
              fontWeight: t.slideLayout.tag.fontWeight,
              letterSpacing: t.slideLayout.tag.letterSpacing,
              textTransform: "uppercase",
            }}
          >
            {String(tag.content)}
          </div>
        )}
        <h1
          className="anim-cover-title anim-delay-2"
          style={{
            fontFamily: t.fonts.heading,
            fontSize: layout.titleSize,
            fontWeight: layout.titleWeight,
            lineHeight: 1.15,
            color: "#ffffff",
            maxWidth: layout.titleMaxWidth,
            marginBottom: "1.25rem",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="anim-fade-up anim-delay-4"
            style={{
              fontFamily: t.fonts.body,
              fontSize: layout.subtitleSize,
              fontWeight: 400,
              lineHeight: 1.5,
              color: vc.textSecondary,
              maxWidth: layout.subtitleMaxWidth,
            }}
          >
            {subtitle}
          </p>
        )}
        <div
          className="mt-auto flex items-center gap-3 anim-fade-up anim-delay-5"
          style={{ color: vc.textMuted, fontSize: layout.brandSize }}
        >
          <div
            className="anim-line-grow anim-delay-6"
            style={{
              width: layout.lineWidth,
              height: layout.lineHeight,
              backgroundColor: t.colors.primaryLight,
            }}
          />
          <span style={{ fontFamily: t.fonts.heading, fontWeight: 600, letterSpacing: "0.04em" }}>
            CONATUS AMBIENTAL
          </span>
        </div>
      </div>
    </div>
  );
}
