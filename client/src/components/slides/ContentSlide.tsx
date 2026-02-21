import type { Slide } from "@shared/schema";
import { TextBlock } from "../blocks/TextBlock";
import { BulletList } from "../blocks/BulletList";
import { ImageBlock } from "../blocks/ImageBlock";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

const t = themeConatus;

interface ContentSlideProps {
  slide: Slide;
  variant: "light" | "dark";
}

export function ContentSlide({ slide, variant }: ContentSlideProps) {
  const isDark = variant === "dark";
  const vc = getVariantColors(variant);
  const title = slide.title || "";
  const subtitle = slide.subtitle || "";

  const textBlocks = slide.components?.filter(c => c.componentType === "text_block") || [];
  const bulletLists = slide.components?.filter(c => c.componentType === "bullet_list") || [];
  const imageBlocks = slide.components?.filter(c => c.componentType === "image_block") || [];
  const tags = slide.components?.filter(c => c.componentType === "tag") || [];

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
            backgroundImage: `url(${t.backgrounds.dark.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: t.backgrounds.dark.opacity,
          }}
        />
      )}
      {!isDark && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${t.backgrounds.light.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: t.backgrounds.light.opacity,
          }}
        />
      )}
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: vc.accent }} />
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
          {title && (
            <div className="anim-fade-up anim-delay-1">
              <TextBlock content={title} variant={variant} size="heading" />
            </div>
          )}
          {subtitle && (
            <div className="anim-fade-up anim-delay-2">
              <TextBlock content={subtitle} variant={variant} size="subtitle" className="mt-2" />
            </div>
          )}
        </div>
        <div className="flex-1 flex gap-6">
          <div className="flex-1 flex flex-col gap-4">
            {textBlocks.map((tb, i) => (
              <div key={i} className={`anim-fade-up anim-delay-${Math.min(i + 3, 8)}`}>
                <TextBlock content={String(tb.content)} variant={variant} size="body" />
              </div>
            ))}
            {bulletLists.map((bl, i) => (
              <div key={i} className={`anim-fade-up anim-delay-${Math.min(i + 3 + textBlocks.length, 8)}`}>
                <BulletList items={Array.isArray(bl.content) ? bl.content : []} variant={variant} />
              </div>
            ))}
          </div>
          {imageBlocks.length > 0 && (
            <div className="flex-shrink-0 anim-fade-in anim-delay-3" style={{ width: "40%" }}>
              {imageBlocks.map((ib, i) => (
                <ImageBlock key={i} src={String(ib.content?.src || ib.content)} alt={String(ib.content?.alt || "")} variant={variant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
