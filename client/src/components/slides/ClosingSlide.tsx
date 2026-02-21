import type { Slide } from "@shared/schema";
import { ContactBlock } from "../blocks/ContactBlock";

interface ClosingSlideProps {
  slide: Slide;
}

export function ClosingSlide({ slide }: ClosingSlideProps) {
  const title = slide.title || "Obrigado";
  const subtitle = slide.subtitle || "";
  const contactComp = slide.components?.find(c => c.componentType === "contact_block");
  const contact = contactComp?.content || {};

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className="relative w-full h-full flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0a1f17 0%, #0f2d22 40%, #143d2e 100%)",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/bg-closing.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-1 anim-line-grow" style={{ background: "linear-gradient(90deg, #22a87e, #1a7a5c, #0d5c45)" }} />
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center" style={{ padding: "4rem 5rem" }}>
        <h1
          className="anim-cover-title anim-delay-1"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "3rem",
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: "0.75rem",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="anim-fade-up anim-delay-2" style={{ fontSize: "1.125rem", color: "#a8cfc0", marginBottom: "2.5rem", maxWidth: "60%" }}>
            {subtitle}
          </p>
        )}
        <div
          className="mt-4 anim-line-grow anim-delay-3"
          style={{
            width: "4rem",
            height: "2px",
            backgroundColor: "#22a87e",
            marginBottom: "2.5rem",
          }}
        />
        {contactComp && (
          <div className="anim-fade-up anim-delay-4">
            <ContactBlock contact={contact} variant="dark" />
          </div>
        )}
        <div
          className="mt-auto flex items-center gap-3 anim-fade-up anim-delay-5"
          style={{ color: "#6b9e8c", fontSize: "0.8125rem" }}
        >
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, letterSpacing: "0.04em" }}>
            CONATUS AMBIENTAL
          </span>
        </div>
      </div>
    </div>
  );
}
