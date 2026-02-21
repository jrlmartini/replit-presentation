import type { Slide } from "@shared/schema";

interface SectionDividerSlideProps {
  slide: Slide;
}

export function SectionDividerSlide({ slide }: SectionDividerSlideProps) {
  const title = slide.title || "[TÍTULO DA SEÇÃO]";
  const subtitle = slide.subtitle || "";

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0d2e22 0%, #145e47 50%, #1a7a5c 100%)",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/bg-section.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
        }}
      />
      <div className="relative z-10 flex flex-col justify-center h-full" style={{ padding: "4rem 5rem" }}>
        <div
          style={{
            width: "3rem",
            height: "3px",
            backgroundColor: "#22a87e",
            marginBottom: "2rem",
          }}
        />
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "2.75rem",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            maxWidth: "70%",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: "1.125rem",
              color: "#a8cfc0",
              marginTop: "1rem",
              maxWidth: "55%",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
