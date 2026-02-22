import type { Slide } from "@shared/schema";
import { ContactBlock } from "../blocks/ContactBlock";
import { ImageBlock } from "../blocks/ImageBlock";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

const t = themeConatus;
const layout = t.slideLayout.closing;
const vc = getVariantColors("dark");

interface ClosingSlideProps {
  slide: Slide;
}

export function ClosingSlide({ slide }: ClosingSlideProps) {
  const headerComps = slide.components?.filter(c => c.slot === "header") || [];
  const mainComps = slide.components?.filter(c => c.slot === "main") || [];
  const contactAreaComps = slide.components?.filter(c => c.slot === "contact_area") || [];

  const hasSlots = headerComps.length > 0 || mainComps.length > 0 || contactAreaComps.length > 0;

  const headerTag = hasSlots
    ? headerComps.find(c => c.componentType === "tag")
    : slide.components?.find(c => c.componentType === "tag");

  const title = slide.title || "Obrigado";
  const subtitle = slide.subtitle || "";

  const contactComp = hasSlots
    ? contactAreaComps.find(c => c.componentType === "contact_block")
    : slide.components?.find(c => c.componentType === "contact_block");
  const contact = contactComp?.content || {};

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        backgroundImage: `url(${t.backgrounds.closing.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 anim-line-grow" style={{ background: t.gradients.progressBar }} />
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center" style={{ padding: t.spacing.slideLarge.padding }}>
        {headerTag && (
          <div
            className="anim-fade-up anim-delay-0"
            style={{
              display: "inline-flex",
              padding: t.slideLayout.tag.paddingMd,
              borderRadius: t.radius.full,
              backgroundColor: t.overlay.darkTagBg,
              border: `1px solid ${t.overlay.darkTagBorder}`,
              color: t.colors.primaryLight,
              fontSize: t.slideLayout.tag.fontSizeMd,
              fontWeight: t.slideLayout.tag.fontWeight,
              letterSpacing: t.slideLayout.tag.letterSpacing,
              textTransform: "uppercase",
              marginBottom: "1.25cqw",
            }}
          >
            {String(headerTag.content)}
          </div>
        )}
        <h1
          className="anim-cover-title anim-delay-1"
          style={{
            fontFamily: t.fonts.heading,
            fontSize: layout.titleSize,
            fontWeight: layout.titleWeight,
            color: "#ffffff",
            marginBottom: "0.95cqw",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="anim-fade-up anim-delay-2" style={{ fontSize: layout.subtitleSize, color: vc.textSecondary, marginBottom: "3.1cqw", maxWidth: layout.subtitleMaxWidth }}>
            {subtitle}
          </p>
        )}
        {mainComps.length > 0 && (
          <div className="anim-fade-up anim-delay-2" style={{ marginBottom: "1.25cqw", display: "flex", flexDirection: "column", gap: "0.6cqw" }}>
            {mainComps.map((comp) => {
              if (comp.componentType === "text_block") {
                return (
                  <p key={comp.id} style={{ fontSize: layout.subtitleSize, color: vc.textSecondary }}>
                    {String(comp.content)}
                  </p>
                );
              }
              if (comp.componentType === "image_block") {
                const imgContent = typeof comp.content === "object" ? comp.content as { src?: string; alt?: string } : {};
                return <div key={comp.id} style={{ maxWidth: "15.6cqw" }}><ImageBlock src={imgContent.src} alt={imgContent.alt} variant="dark" /></div>;
              }
              return null;
            })}
          </div>
        )}
        <div
          className="anim-line-grow anim-delay-3"
          style={{
            width: layout.dividerWidth,
            height: layout.dividerHeight,
            backgroundColor: t.colors.primaryLight,
            marginTop: "1.25cqw",
            marginBottom: "3.1cqw",
          }}
        />
        {contactComp && (
          <div className="anim-fade-up anim-delay-4">
            <ContactBlock contact={contact} variant="dark" />
          </div>
        )}
        <div
          className="mt-auto flex items-center anim-fade-up anim-delay-5"
          style={{ color: vc.textMuted, fontSize: t.slideLayout.cover.brandSize, gap: "0.95cqw" }}
        >
          <span style={{ fontFamily: t.fonts.heading, fontWeight: 600, letterSpacing: "0.04em" }}>
            CONATUS AMBIENTAL
          </span>
        </div>
      </div>
    </div>
  );
}
