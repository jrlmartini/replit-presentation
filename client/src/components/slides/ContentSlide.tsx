import type { Slide } from "@shared/schema";
import { TextBlock } from "../blocks/TextBlock";
import { BulletList } from "../blocks/BulletList";
import { ImageBlock } from "../blocks/ImageBlock";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

const t = themeConatus;

interface ContentSlideProps {
  slide: Slide;
  variant: "light" | "dark";
  layoutVariant?: string;
}

function getColumnProportions(layoutVariant: string): string {
  const proportions = (t.columnProportions as unknown as Record<string, readonly string[]>)[layoutVariant];
  if (proportions) return proportions.join(" ");
  return "1fr";
}

function renderSlotComponents(comps: any[], variant: "light" | "dark", baseDelay: number) {
  return comps.map((comp, i) => {
    const delay = Math.min(baseDelay + i, 8);
    switch (comp.componentType) {
      case "text_block":
        return <div key={i} className={`anim-fade-up anim-delay-${delay}`}><TextBlock content={String(comp.content)} variant={variant} size="body" /></div>;
      case "bullet_list":
        return <div key={i} className={`anim-fade-up anim-delay-${delay}`}><BulletList items={Array.isArray(comp.content) ? comp.content : []} variant={variant} /></div>;
      case "image_block":
        return <div key={i} className={`anim-fade-in anim-delay-${delay}`}><ImageBlock src={String(comp.content?.src || comp.content)} alt={String(comp.content?.alt || "")} variant={variant} /></div>;
      default:
        return null;
    }
  });
}

export function ContentSlide({ slide, variant, layoutVariant }: ContentSlideProps) {
  const isDark = variant === "dark";
  const vc = getVariantColors(variant);
  const title = slide.title || "";
  const subtitle = slide.subtitle || "";

  const resolvedLayout = layoutVariant || slide.layout?.variant || "single_col";

  const isMultiCol = resolvedLayout.startsWith("two_cols_") || resolvedLayout.startsWith("three_cols_");
  const isThreeCol = resolvedLayout.startsWith("three_cols_");

  const tags = slide.components?.filter(c => c.componentType === "tag" && (c.slot === "header" || !c.slot)) || [];

  let col1Comps: any[] = [];
  let col2Comps: any[] = [];
  let col3Comps: any[] = [];
  let mainComps: any[] = [];

  if (isMultiCol) {
    col1Comps = slide.components?.filter(c => c.slot === "col_1" || c.slot === "left") || [];
    col2Comps = slide.components?.filter(c => c.slot === "col_2" || c.slot === "right") || [];
    if (isThreeCol) {
      col3Comps = slide.components?.filter(c => c.slot === "col_3") || [];
    }

    if (col1Comps.length === 0 && col2Comps.length === 0) {
      const contentComps = slide.components?.filter(c =>
        c.componentType !== "tag" && c.slot !== "header"
      ) || [];
      if (isThreeCol) {
        const third = Math.ceil(contentComps.length / 3);
        col1Comps = contentComps.slice(0, third);
        col2Comps = contentComps.slice(third, third * 2);
        col3Comps = contentComps.slice(third * 2);
      } else {
        const half = Math.ceil(contentComps.length / 2);
        col1Comps = contentComps.slice(0, half);
        col2Comps = contentComps.slice(half);
      }
    }
  } else {
    mainComps = slide.components?.filter(c =>
      c.componentType !== "tag" || c.slot === "main"
    ) || [];
    const textBlocks = mainComps.filter(c => c.componentType === "text_block");
    const bulletLists = mainComps.filter(c => c.componentType === "bullet_list");
    const imageBlocks = mainComps.filter(c => c.componentType === "image_block");
    mainComps = [...textBlocks, ...bulletLists, ...imageBlocks];
  }

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
          {title && <div className="anim-fade-up anim-delay-1"><TextBlock content={title} variant={variant} size="heading" /></div>}
          {subtitle && <div className="anim-fade-up anim-delay-2"><TextBlock content={subtitle} variant={variant} size="subtitle" className="mt-2" /></div>}
        </div>

        {isMultiCol ? (
          <div
            className="flex-1"
            style={{
              display: "grid",
              gridTemplateColumns: getColumnProportions(resolvedLayout),
              gap: "2rem",
            }}
          >
            <div
              className="flex flex-col gap-4 anim-fade-up anim-delay-3"
              style={{
                padding: t.spacing.content.gap,
                borderRadius: t.radius.md,
                backgroundColor: vc.surfaceOverlay,
                border: `1px solid ${vc.surfaceBorder}`,
              }}
            >
              {renderSlotComponents(col1Comps, variant, 3)}
            </div>
            <div
              className="flex flex-col gap-4 anim-fade-up anim-delay-5"
              style={{
                padding: t.spacing.content.gap,
                borderRadius: t.radius.md,
                backgroundColor: vc.surfaceOverlay,
                border: `1px solid ${vc.surfaceBorder}`,
              }}
            >
              {renderSlotComponents(col2Comps, variant, 5)}
            </div>
            {isThreeCol && (
              <div
                className="flex flex-col gap-4 anim-fade-up anim-delay-6"
                style={{
                  padding: t.spacing.content.gap,
                  borderRadius: t.radius.md,
                  backgroundColor: vc.surfaceOverlay,
                  border: `1px solid ${vc.surfaceBorder}`,
                }}
              >
                {renderSlotComponents(col3Comps, variant, 6)}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex gap-6">
            <div className="flex-1 flex flex-col gap-4">
              {mainComps.filter(c => c.componentType !== "image_block").map((comp, i) => {
                const delay = Math.min(i + 3, 8);
                if (comp.componentType === "text_block") {
                  return <div key={i} className={`anim-fade-up anim-delay-${delay}`}><TextBlock content={String(comp.content)} variant={variant} size="body" /></div>;
                }
                if (comp.componentType === "bullet_list") {
                  return <div key={i} className={`anim-fade-up anim-delay-${delay}`}><BulletList items={Array.isArray(comp.content) ? comp.content : []} variant={variant} /></div>;
                }
                return null;
              })}
            </div>
            {mainComps.some(c => c.componentType === "image_block") && (
              <div className="flex-shrink-0 anim-fade-in anim-delay-3" style={{ width: "40%" }}>
                {mainComps.filter(c => c.componentType === "image_block").map((ib, i) => (
                  <ImageBlock key={i} src={String(ib.content?.src || ib.content)} alt={String(ib.content?.alt || "")} variant={variant} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
