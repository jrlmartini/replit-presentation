import type { Slide } from "@shared/schema";
import { TextBlock } from "../blocks/TextBlock";
import { IconFeatureItem } from "../blocks/IconFeatureItem";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

const t = themeConatus;

interface IconFeaturesSlideProps {
  slide: Slide;
  variant: "light" | "dark";
  layoutVariant: string;
}

export function IconFeaturesSlide({ slide, variant, layoutVariant }: IconFeaturesSlideProps) {
  const isDark = variant === "dark";
  const vc = getVariantColors(variant);
  const title = slide.title || "";
  const subtitle = slide.subtitle || "";

  const headerComps = slide.components?.filter(c => c.slot === "header") || [];
  const tags = headerComps.filter(c => c.componentType === "tag");
  const iconItems = slide.components?.filter(c =>
    c.componentType === "icon_feature_item" &&
    (c.slot === "icon_items" || c.slot === "right_icon_items" || !c.slot)
  ) || [];
  const emphasisComp = slide.components?.find(c => c.slot === "left_emphasis");

  if (layoutVariant === "icons_3_vertical_with_quote") {
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
        <div className="relative z-10 flex flex-col h-full" style={{ padding: t.spacing.slide.padding }}>
          <div className="mb-6">
            {tags.length > 0 && (
              <div className="flex gap-2 mb-3 anim-fade-up anim-delay-1">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      padding: t.slideLayout.tag.paddingSm,
                      borderRadius: t.radius.full,
                      backgroundColor: vc.tagBg,
                      border: `1px solid ${vc.tagBorder}`,
                      color: vc.accent,
                      fontSize: t.slideLayout.tag.fontSize,
                      fontWeight: t.slideLayout.tag.fontWeight,
                      textTransform: "uppercase",
                      letterSpacing: t.slideLayout.tag.letterSpacing,
                    }}
                  >
                    {String(tag.content)}
                  </span>
                ))}
              </div>
            )}
            {title && <div className="anim-fade-up anim-delay-1"><TextBlock content={title} variant={variant} size="heading" /></div>}
            {subtitle && <div className="anim-fade-up anim-delay-2"><TextBlock content={subtitle} variant={variant} size="subtitle" className="mt-2" /></div>}
          </div>
          <div className="flex-1 flex gap-8">
            <div
              className="flex-1 flex items-center anim-fade-up anim-delay-3"
              style={{
                padding: t.spacing.content.gap,
                borderRadius: t.radius.md,
                backgroundColor: vc.surfaceOverlay,
                border: `1px solid ${vc.surfaceBorder}`,
              }}
            >
              {emphasisComp ? (
                <p
                  style={{
                    fontFamily: t.fonts.heading,
                    fontSize: t.iconLayout.quoteSize,
                    fontWeight: t.iconLayout.quoteWeight,
                    lineHeight: t.iconLayout.quoteLineHeight,
                    color: vc.text,
                    fontStyle: "italic",
                  }}
                >
                  "{String(emphasisComp.content)}"
                </p>
              ) : (
                <TextBlock content="[INSERIR FRASE DE DESTAQUE]" variant={variant} size="heading" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-6 justify-center">
              {iconItems.map((item, i) => {
                const content = item.content as any;
                return (
                  <div key={i} className={`anim-fade-up anim-delay-${Math.min(i + 4, 8)}`}>
                    <div className="flex items-start gap-4">
                      <IconFeatureItem
                        iconName={content?.iconName}
                        iconSrc={content?.iconSrc}
                        title={content?.title || ""}
                        text={content?.text || ""}
                        variant={variant}
                        className="!flex-row !items-start !text-left"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isHorizontal4 = layoutVariant === "icons_4_horizontal";

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
      <div className="relative z-10 flex flex-col h-full" style={{ padding: t.spacing.slide.padding }}>
        <div className="mb-8">
          {tags.length > 0 && (
            <div className="flex gap-2 mb-3 anim-fade-up anim-delay-1">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    padding: t.slideLayout.tag.paddingSm,
                    borderRadius: t.radius.full,
                    backgroundColor: vc.tagBg,
                    border: `1px solid ${vc.tagBorder}`,
                    color: vc.accent,
                    fontSize: t.slideLayout.tag.fontSize,
                    fontWeight: t.slideLayout.tag.fontWeight,
                    textTransform: "uppercase",
                    letterSpacing: t.slideLayout.tag.letterSpacing,
                  }}
                >
                  {String(tag.content)}
                </span>
              ))}
            </div>
          )}
          {title && <div className="anim-fade-up anim-delay-1"><TextBlock content={title} variant={variant} size="heading" /></div>}
          {subtitle && <div className="anim-fade-up anim-delay-2"><TextBlock content={subtitle} variant={variant} size="subtitle" className="mt-2" /></div>}
        </div>
        <div
          className="flex-1 flex items-center justify-center"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${isHorizontal4 ? 4 : 3}, 1fr)`,
            gap: t.iconLayout.iconGap,
          }}
        >
          {iconItems.map((item, i) => {
            const content = item.content as any;
            return (
              <div key={i} className={`anim-fade-up anim-delay-${Math.min(i + 3, 8)}`}>
                <IconFeatureItem
                  iconName={content?.iconName}
                  iconSrc={content?.iconSrc}
                  title={content?.title || ""}
                  text={content?.text || ""}
                  variant={variant}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
