import type { Slide } from "@shared/schema";
import { ContactBlock } from "../blocks/ContactBlock";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

const t = themeConatus;
const layout = t.slideLayout.closing;
const vc = getVariantColors("dark");

interface ClosingSlideProps {
  slide: Slide;
}

export function ClosingSlide({ slide }: ClosingSlideProps) {
  const title = slide.title || "Obrigado";
  const subtitle = slide.subtitle || "";
  const contactComp = slide.components?.find(c => c.componentType === "contact_block");
  const contact = contactComp?.content || {};

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        background: t.gradients.closingBg,
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${t.backgrounds.closing.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: t.backgrounds.closing.opacity,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-1 anim-line-grow" style={{ background: t.gradients.progressBar }} />
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center" style={{ padding: t.spacing.slideLarge.padding }}>
        <h1
          className="anim-cover-title anim-delay-1"
          style={{
            fontFamily: t.fonts.heading,
            fontSize: layout.titleSize,
            fontWeight: layout.titleWeight,
            color: "#ffffff",
            marginBottom: "0.75rem",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="anim-fade-up anim-delay-2" style={{ fontSize: layout.subtitleSize, color: vc.textSecondary, marginBottom: "2.5rem", maxWidth: layout.subtitleMaxWidth }}>
            {subtitle}
          </p>
        )}
        <div
          className="mt-4 anim-line-grow anim-delay-3"
          style={{
            width: layout.dividerWidth,
            height: layout.dividerHeight,
            backgroundColor: t.colors.primaryLight,
            marginBottom: "2.5rem",
          }}
        />
        {contactComp && (
          <div className="anim-fade-up anim-delay-4">
            <ContactBlock contact={contact} variant="dark" />
          </div>
        )}
        <div
          className="mt-auto flex items-center gap-3 anim-fade-up anim-delay-5"
          style={{ color: vc.textMuted, fontSize: t.slideLayout.cover.brandSize }}
        >
          <span style={{ fontFamily: t.fonts.heading, fontWeight: 600, letterSpacing: "0.04em" }}>
            CONATUS AMBIENTAL
          </span>
        </div>
      </div>
    </div>
  );
}
