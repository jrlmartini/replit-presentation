import type { Slide } from "@shared/schema";
import { TextBlock } from "../blocks/TextBlock";
import { BulletList } from "../blocks/BulletList";
import { ImageBlock } from "../blocks/ImageBlock";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

const t = themeConatus;

interface TwoColumnsSlideProps {
  slide: Slide;
  variant: "light" | "dark";
}

export function TwoColumnsSlide({ slide, variant }: TwoColumnsSlideProps) {
  const isDark = variant === "dark";
  const vc = getVariantColors(variant);
  const title = slide.title || "";
  const subtitle = slide.subtitle || "";

  const leftComponents = slide.components?.filter(c => c.slot === "left" || c.slot === "col1") || [];
  const rightComponents = slide.components?.filter(c => c.slot === "right" || c.slot === "col2") || [];

  if (leftComponents.length === 0 && rightComponents.length === 0) {
    const half = Math.ceil((slide.components?.length || 0) / 2);
    leftComponents.push(...(slide.components?.slice(0, half) || []));
    rightComponents.push(...(slide.components?.slice(half) || []));
  }

  function renderComponents(comps: typeof leftComponents) {
    return comps.map((comp, i) => {
      switch (comp.componentType) {
        case "text_block":
          return <TextBlock key={i} content={String(comp.content)} variant={variant} size="body" />;
        case "bullet_list":
          return <BulletList key={i} items={Array.isArray(comp.content) ? comp.content : []} variant={variant} />;
        case "image_block":
          return <ImageBlock key={i} src={String(comp.content?.src || comp.content)} variant={variant} />;
        default:
          return null;
      }
    });
  }

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
      <div className="relative z-10 flex flex-col h-full" style={{ padding: t.spacing.slide.padding }}>
        <div className="mb-6">
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
        <div className="flex-1 flex gap-8">
          <div
            className="flex-1 flex flex-col gap-4 anim-fade-up anim-delay-3"
            style={{
              padding: t.spacing.content.gap,
              borderRadius: t.radius.md,
              backgroundColor: vc.surfaceOverlay,
              border: `1px solid ${vc.surfaceBorder}`,
            }}
          >
            {renderComponents(leftComponents)}
          </div>
          <div
            className="flex-1 flex flex-col gap-4 anim-fade-up anim-delay-5"
            style={{
              padding: t.spacing.content.gap,
              borderRadius: t.radius.md,
              backgroundColor: vc.surfaceOverlay,
              border: `1px solid ${vc.surfaceBorder}`,
            }}
          >
            {renderComponents(rightComponents)}
          </div>
        </div>
      </div>
    </div>
  );
}
