import type { Slide } from "@shared/schema";
import { TextBlock } from "../blocks/TextBlock";
import { BulletList } from "../blocks/BulletList";
import { ImageBlock } from "../blocks/ImageBlock";

interface ContentSlideProps {
  slide: Slide;
  variant: "light" | "dark";
}

export function ContentSlide({ slide, variant }: ContentSlideProps) {
  const isDark = variant === "dark";
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
      {!isDark && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/bg-light.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />
      )}
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: isDark ? "#22a87e" : "#1a7a5c" }} />
      <div className="relative z-10 flex flex-col h-full" style={{ padding: "3rem 4.5rem" }}>
        <div className="mb-6">
          {tags.length > 0 && (
            <div className="flex gap-2 mb-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "2rem",
                    backgroundColor: isDark ? "rgba(34,168,126,0.15)" : "rgba(26,122,92,0.1)",
                    border: `1px solid ${isDark ? "rgba(34,168,126,0.3)" : "rgba(26,122,92,0.2)"}`,
                    color: isDark ? "#22a87e" : "#1a7a5c",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {String(tag.content)}
                </span>
              ))}
            </div>
          )}
          {title && <TextBlock content={title} variant={variant} size="heading" />}
          {subtitle && <TextBlock content={subtitle} variant={variant} size="subtitle" className="mt-2" />}
        </div>
        <div className="flex-1 flex gap-6">
          <div className="flex-1 flex flex-col gap-4">
            {textBlocks.map((tb, i) => (
              <TextBlock key={i} content={String(tb.content)} variant={variant} size="body" />
            ))}
            {bulletLists.map((bl, i) => (
              <BulletList key={i} items={Array.isArray(bl.content) ? bl.content : []} variant={variant} />
            ))}
          </div>
          {imageBlocks.length > 0 && (
            <div className="flex-shrink-0" style={{ width: "40%" }}>
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
