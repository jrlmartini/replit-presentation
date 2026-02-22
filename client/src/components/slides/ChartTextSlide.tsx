import type { Slide } from "@shared/schema";
import { TextBlock } from "../blocks/TextBlock";
import { BulletList } from "../blocks/BulletList";
import { ChartBlock } from "../blocks/ChartBlock";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

const t = themeConatus;

interface ChartTextSlideProps {
  slide: Slide;
  variant: "light" | "dark";
  layoutVariant?: string;
}

export function ChartTextSlide({ slide, variant, layoutVariant }: ChartTextSlideProps) {
  const isDark = variant === "dark";
  const vc = getVariantColors(variant);
  const title = slide.title || "";
  const subtitle = slide.subtitle || "";

  const resolvedLayout = layoutVariant || slide.layout?.variant || "chart_left_text_right";
  const chartFirst = resolvedLayout !== "text_left_chart_right";

  const chartComp = slide.components?.find(c =>
    c.componentType === "chart_block" || c.slot === "chart_area"
  );
  const textComps = slide.components?.filter(c =>
    (c.componentType === "text_block" && c.slot !== "header") ||
    c.slot === "text_area"
  ) || [];
  const bulletComps = slide.components?.filter(c =>
    c.componentType === "bullet_list"
  ) || [];
  const tags = slide.components?.filter(c => c.componentType === "tag") || [];

  const chartData = chartComp?.content?.data || chartComp?.content;
  const chartType = chartComp?.content?.chartType || "bar";
  const chartTitle = chartComp?.content?.title;
  const chartUnit = chartComp?.content?.unit;

  const chartSection = (
    <div className={`flex-1 anim-fade-in anim-delay-3`}>
      <ChartBlock
        data={Array.isArray(chartData) ? chartData : undefined}
        chartType={chartType}
        title={chartTitle}
        unit={chartUnit}
        variant={variant}
      />
    </div>
  );

  const textSection = (
    <div className="flex-1 flex flex-col gap-4">
      {textComps.map((tc, i) => (
        <div key={i} className={`anim-fade-up anim-delay-${Math.min(i + 4, 8)}`}>
          <TextBlock content={String(tc.content)} variant={variant} size="body" />
        </div>
      ))}
      {bulletComps.map((bl, i) => (
        <div key={i} className={`anim-fade-up anim-delay-${Math.min(i + 4 + textComps.length, 8)}`}>
          <BulletList items={Array.isArray(bl.content) ? bl.content : []} variant={variant} icon="check" />
        </div>
      ))}
    </div>
  );

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
          {chartFirst ? (
            <>{chartSection}{textSection}</>
          ) : (
            <>{textSection}{chartSection}</>
          )}
        </div>
      </div>
    </div>
  );
}
