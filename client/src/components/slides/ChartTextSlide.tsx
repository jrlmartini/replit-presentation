import type { Slide } from "@shared/schema";
import { TextBlock } from "../blocks/TextBlock";
import { BulletList } from "../blocks/BulletList";
import { ChartBlock } from "../blocks/ChartBlock";

interface ChartTextSlideProps {
  slide: Slide;
  variant: "light" | "dark";
}

export function ChartTextSlide({ slide, variant }: ChartTextSlideProps) {
  const isDark = variant === "dark";
  const title = slide.title || "";
  const subtitle = slide.subtitle || "";

  const chartComp = slide.components?.find(c => c.componentType === "chart_block");
  const textComps = slide.components?.filter(c => c.componentType === "text_block") || [];
  const bulletComps = slide.components?.filter(c => c.componentType === "bullet_list") || [];

  const chartData = chartComp?.content?.data || chartComp?.content;
  const chartType = chartComp?.content?.chartType || "bar";
  const chartTitle = chartComp?.content?.title;
  const chartUnit = chartComp?.content?.unit;

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0f1f1a 0%, #142b23 50%, #1a3a2e 100%)"
          : "linear-gradient(135deg, #f5faf8 0%, #edf6f2 100%)",
        overflow: "hidden",
      }}
    >
      {isDark && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/bg-dark.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        />
      )}
      <div className="relative z-10 flex flex-col h-full" style={{ padding: "3rem 4.5rem" }}>
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
          <div className="flex-1 anim-fade-in anim-delay-3">
            <ChartBlock
              data={Array.isArray(chartData) ? chartData : undefined}
              chartType={chartType}
              title={chartTitle}
              unit={chartUnit}
              variant={variant}
            />
          </div>
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
        </div>
      </div>
    </div>
  );
}
