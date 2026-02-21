import type { Slide } from "@shared/schema";

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
        background: "linear-gradient(135deg, #0a1f17 0%, #0f2d22 30%, #143d2e 60%, #1a5040 100%)",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/bg-cover.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.35,
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #22a87e, #1a7a5c, #0d5c45)" }} />
      <div className="relative z-10 flex flex-col justify-center h-full" style={{ padding: "4rem 5rem" }}>
        {tag && (
          <div
            className="mb-6"
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "0.375rem 1rem",
              borderRadius: "2rem",
              backgroundColor: "rgba(34, 168, 126, 0.15)",
              border: "1px solid rgba(34, 168, 126, 0.3)",
              color: "#22a87e",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {String(tag.content)}
          </div>
        )}
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "3rem",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#ffffff",
            maxWidth: "70%",
            marginBottom: "1.25rem",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.25rem",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#a8cfc0",
              maxWidth: "60%",
            }}
          >
            {subtitle}
          </p>
        )}
        <div
          className="mt-auto flex items-center gap-3"
          style={{ color: "#6b9e8c", fontSize: "0.8125rem" }}
        >
          <div
            style={{
              width: "2rem",
              height: "2px",
              backgroundColor: "#22a87e",
            }}
          />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, letterSpacing: "0.04em" }}>
            CONATUS AMBIENTAL
          </span>
        </div>
      </div>
    </div>
  );
}
