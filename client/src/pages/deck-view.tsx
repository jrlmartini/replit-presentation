import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { DeckUnlock } from "./deck-unlock";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import { ChevronLeft, ChevronRight, Grid, X, Layers, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Deck, DeckAst, Slide } from "@shared/schema";

export default function DeckView() {
  const [, params] = useRoute("/deck/:id");
  const deckId = params?.id || "";
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`deck-token-${params?.id || ""}`);
    }
    return null;
  });

  const handleUnlock = (newToken: string) => {
    localStorage.setItem(`deck-token-${deckId}`, newToken);
    setToken(newToken);
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: meta } = useQuery<{ id: string; title: string; isPasswordProtected: boolean }>({
    queryKey: ["/api/deck", deckId, "meta"],
    enabled: !!deckId,
  });

  const { data: deck, isLoading, error } = useQuery<Deck>({
    queryKey: ["/api/deck", deckId, { token }],
    enabled: !!deckId && (!meta?.isPasswordProtected || !!token),
    queryFn: async () => {
      const url = token ? `/api/deck/${deckId}?token=${token}` : `/api/deck/${deckId}`;
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 401) {
        localStorage.removeItem(`deck-token-${deckId}`);
        setToken(null);
        throw new Error("Token expirado");
      }
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }
      return res.json();
    },
  });

  const deckAst = deck?.deckAst as DeckAst | null;
  const slides = deckAst?.slides || [];
  const totalSlides = slides.length;

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
      setShowGrid(false);
    }
  }, [totalSlides]);

  const goNext = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const goPrev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        if (showGrid) setShowGrid(false);
        else if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      } else if (e.key === "g") {
        setShowGrid(prev => !prev);
      } else if (e.key === "f") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, showGrid, toggleFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (meta?.isPasswordProtected && !token) {
    return <DeckUnlock deckId={deckId} deckTitle={meta.title} onUnlock={handleUnlock} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f1f1a" }}>
        <div className="animate-pulse text-center">
          <Layers size={40} style={{ color: "#22a87e", margin: "0 auto 1rem" }} />
          <p style={{ color: "#a8cfc0", fontSize: "0.875rem" }}>Carregando apresentação...</p>
        </div>
      </div>
    );
  }

  if (error || !deck || !deckAst || totalSlides === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f1f1a" }}>
        <div className="text-center">
          <p style={{ color: "#e8f5f0", fontSize: "1.125rem", fontWeight: 600 }}>
            {error ? "Erro ao carregar" : "Nenhum slide encontrado"}
          </p>
          <p style={{ color: "#6b9e8c", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {error?.message || "Esta apresentação pode estar vazia."}
          </p>
        </div>
      </div>
    );
  }

  if (showGrid) {
    return (
      <div className="min-h-screen" style={{ background: "#0f1f1a" }}>
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid #2a5a48" }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#e8f5f0", fontWeight: 600 }}>
            {deckAst.meta.title} — Visão Geral
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGrid(false)}
            data-testid="button-close-grid"
          >
            <X size={18} style={{ color: "#a8cfc0" }} />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {slides.map((slide: Slide, i: number) => (
            <button
              key={slide.id}
              data-testid={`grid-slide-${i}`}
              onClick={() => goToSlide(i)}
              className="relative group rounded overflow-hidden transition-all duration-200"
              style={{
                border: i === currentSlide ? "2px solid #22a87e" : "2px solid transparent",
                aspectRatio: "16/9",
              }}
            >
              <div className="w-full h-full" style={{ transform: "scale(1)", transformOrigin: "top left" }}>
                <SlideRenderer slide={slide} />
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              >
                <span style={{ color: "#a8cfc0", fontSize: "0.6875rem" }}>
                  {i + 1}/{totalSlides}
                </span>
                <span style={{ color: "#e8f5f0", fontSize: "0.6875rem", fontWeight: 500 }}>
                  {slide.title?.slice(0, 30) || slide.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen flex flex-col"
      style={{ background: "#0a1612" }}
    >
      <div className="flex-1 flex items-center justify-center relative" style={{ overflow: "hidden" }}>
        <div
          className="relative"
          style={{
            width: "100%",
            maxWidth: "calc(100vh * 16 / 9)",
            aspectRatio: "16/9",
          }}
        >
          <SlideRenderer slide={slides[currentSlide]} />
        </div>

        {currentSlide > 0 && (
          <button
            data-testid="button-prev-slide"
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity opacity-40 hover:opacity-100"
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          >
            <ChevronLeft size={20} style={{ color: "#ffffff" }} />
          </button>
        )}

        {currentSlide < totalSlides - 1 && (
          <button
            data-testid="button-next-slide"
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity opacity-40 hover:opacity-100"
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          >
            <ChevronRight size={20} style={{ color: "#ffffff" }} />
          </button>
        )}
      </div>

      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          borderTop: "1px solid rgba(42, 90, 72, 0.3)",
          backgroundColor: "rgba(10, 22, 18, 0.9)",
        }}
      >
        <div className="flex items-center gap-3">
          <Layers size={14} style={{ color: "#6b9e8c" }} />
          <span style={{ color: "#6b9e8c", fontSize: "0.75rem", fontWeight: 500 }}>
            {deckAst.meta.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "0.25rem",
              backgroundColor: "rgba(34, 168, 126, 0.1)",
              border: "1px solid rgba(34, 168, 126, 0.2)",
              color: "#22a87e",
              fontSize: "0.8125rem",
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {currentSlide + 1} / {totalSlides}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGrid(true)}
            data-testid="button-grid-view"
            style={{ color: "#6b9e8c" }}
          >
            <Grid size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            data-testid="button-fullscreen"
            style={{ color: "#6b9e8c" }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>

      <div className="h-1" style={{ backgroundColor: "rgba(42, 90, 72, 0.2)" }}>
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / totalSlides) * 100}%`,
            background: "linear-gradient(90deg, #1a7a5c, #22a87e)",
          }}
        />
      </div>
    </div>
  );
}
