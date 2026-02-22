import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { DeckUnlock } from "./deck-unlock";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import { SlideEditor } from "@/components/slides/SlideEditor";
import { ChevronLeft, ChevronRight, Grid, X, Layers, Maximize2, Minimize2, Home, Pencil, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Deck, DeckAst, Slide } from "@shared/schema";

export default function DeckView() {
  const [, params] = useRoute("/deck/:id");
  const [, navigate] = useLocation();
  const deckId = params?.id || "";
  const { toast } = useToast();
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedAst, setEditedAst] = useState<DeckAst | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">("forward");
  const [slideKey, setSlideKey] = useState(0);

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

  const saveMutation = useMutation({
    mutationFn: async (ast: DeckAst) => {
      const url = `/api/deck/${deckId}${token ? `?token=${token}` : ""}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckAst: ast }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      return res.json();
    },
    onSuccess: () => {
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["/api/deck", deckId] });
      toast({ title: "Salvo", description: "Alterações salvas com sucesso." });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    },
  });

  const generateImageMutation = useMutation({
    mutationFn: async ({ prompt, slideIndex, componentIndex }: { prompt: string; slideIndex: number; componentIndex: number }) => {
      const url = `/api/deck/${deckId}/generate-image${token ? `?token=${token}` : ""}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, slideIndex, componentIndex }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      return res.json();
    },
  });

  const originalAst = deck?.deckAst as DeckAst | null;
  const deckAst = editedAst || originalAst;
  const slides = deckAst?.slides || [];
  const totalSlides = slides.length;

  useEffect(() => {
    if (originalAst && !editedAst) {
      setEditedAst(JSON.parse(JSON.stringify(originalAst)));
    }
  }, [originalAst]);

  const handleAstUpdate = (newAst: DeckAst) => {
    setEditedAst(newAst);
    setHasChanges(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveMutation.mutate(newAst);
    }, 2000);
  };

  const handleSaveNow = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (editedAst) {
      saveMutation.mutate(editedAst);
    }
  };

  const handleGenerateImage = async (prompt: string, slideIndex: number, componentIndex: number): Promise<string | null> => {
    try {
      const result = await generateImageMutation.mutateAsync({ prompt, slideIndex, componentIndex });
      if (result.dataUri && editedAst) {
        const newAst = JSON.parse(JSON.stringify(editedAst));
        if (newAst.slides?.[slideIndex]?.components?.[componentIndex]) {
          newAst.slides[slideIndex].components[componentIndex].content = {
            src: result.dataUri,
            alt: prompt,
          };
          setEditedAst(newAst);
          saveMutation.mutate(newAst);
        }
        return result.dataUri;
      }
      return null;
    } catch (err: any) {
      toast({ title: "Erro ao gerar imagem", description: err.message, variant: "destructive" });
      return null;
    }
  };

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setSlideDirection(index >= currentSlide ? "forward" : "backward");
      setSlideKey(prev => prev + 1);
      setCurrentSlide(index);
      setShowGrid(false);
    }
  }, [totalSlides, currentSlide]);

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

  const toggleEditing = () => {
    if (isEditing && hasChanges && editedAst) {
      handleSaveNow();
    }
    setIsEditing(!isEditing);
    if (isFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isEditing) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      }
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        if (isEditing) setIsEditing(false);
        else if (showGrid) setShowGrid(false);
        else if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      } else if (e.key === "g" && !isEditing) {
        setShowGrid(prev => !prev);
      } else if (e.key === "f" && !isEditing) {
        toggleFullscreen();
      } else if (e.key === "e") {
        toggleEditing();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, showGrid, toggleFullscreen, isEditing]);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#03131e" }}>
        <div className="animate-pulse text-center">
          <Layers size={40} style={{ color: "#2b93ac", margin: "0 auto 1rem" }} />
          <p style={{ color: "#7a9eb5", fontSize: "0.875rem" }}>Carregando apresentação...</p>
        </div>
      </div>
    );
  }

  if (error || !deck || !deckAst || totalSlides === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#03131e" }}>
        <div className="text-center">
          <p style={{ color: "#f2f2f2", fontSize: "1.125rem", fontWeight: 600 }}>
            {error ? "Erro ao carregar" : "Nenhum slide encontrado"}
          </p>
          <p style={{ color: "#7a9eb5", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {error?.message || "Esta apresentação pode estar vazia."}
          </p>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mt-4"
            style={{ color: "#2b93ac" }}
            data-testid="button-error-back-home"
          >
            <Home size={16} className="mr-2" /> Voltar ao menu
          </Button>
        </div>
      </div>
    );
  }

  if (showGrid) {
    return (
      <div className="min-h-screen" style={{ background: "#03131e" }}>
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", color: "#e6ecf0", fontWeight: 600 }}>
            {deckAst.meta.title} — Visão Geral
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              data-testid="button-grid-back-home"
              title="Voltar ao menu"
            >
              <Home size={18} style={{ color: "#7a9eb5" }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGrid(false)}
              data-testid="button-close-grid"
            >
              <X size={18} style={{ color: "#7a9eb5" }} />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {slides.map((slide: Slide, i: number) => (
            <button
              key={slide.id}
              data-testid={`grid-slide-${i}`}
              onClick={() => goToSlide(i)}
              className="relative group rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.02]"
              style={{
                border: i === currentSlide ? "2px solid #2b93ac" : "2px solid rgba(255,255,255,0.06)",
                aspectRatio: "16/9",
              }}
            >
              <div className="w-full h-full" style={{ transform: "scale(1)", transformOrigin: "top left" }}>
                <SlideRenderer slide={slide} />
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between"
                style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
              >
                <span style={{ color: "#7a9eb5", fontSize: "0.6875rem" }}>
                  {i + 1}/{totalSlides}
                </span>
                <span style={{ color: "#e6ecf0", fontSize: "0.6875rem", fontWeight: 500 }}>
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
      style={{ background: "#020e16" }}
    >
      <div className="flex-1 flex" style={{ overflow: "hidden" }}>
        <div className="flex-1 flex items-center justify-center relative" style={{ overflow: "hidden" }}>
          <div
            key={slideKey}
            className={`relative ${slideDirection === "forward" ? "slide-transition-forward" : "slide-transition-backward"}`}
            style={{
              width: "100%",
              maxWidth: isEditing ? "calc((100vh - 4rem) * 16 / 9)" : "calc(100vh * 16 / 9)",
              aspectRatio: "16/9",
            }}
          >
            <SlideRenderer slide={slides[currentSlide]} />
          </div>

          {currentSlide > 0 && (
            <button
              data-testid="button-prev-slide"
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-opacity opacity-40 hover:opacity-100"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-opacity opacity-40 hover:opacity-100"
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

        {isEditing && deckAst && (
          <SlideEditor
            slide={slides[currentSlide]}
            slideIndex={currentSlide}
            deckAst={deckAst}
            deckId={deckId}
            token={token}
            onUpdate={handleAstUpdate}
            onClose={() => {
              if (hasChanges && editedAst) handleSaveNow();
              setIsEditing(false);
            }}
            onGenerateImage={handleGenerateImage}
            isSaving={saveMutation.isPending}
          />
        )}
      </div>

      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          backgroundColor: "#020e16F0",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            data-testid="button-back-home"
            title="Voltar ao menu"
            style={{ color: "#7a9eb5" }}
          >
            <Home size={16} />
          </Button>
          <Layers size={14} style={{ color: "#7a9eb5" }} />
          <span style={{ color: "#7a9eb5", fontSize: "0.75rem", fontWeight: 500 }}>
            {deckAst.meta.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "0.375rem",
              backgroundColor: "rgba(43,147,172,0.12)",
              border: "1px solid rgba(43,147,172,0.25)",
              color: "#2b93ac",
              fontSize: "0.8125rem",
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {currentSlide + 1} / {totalSlides}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {hasChanges && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveNow}
              disabled={saveMutation.isPending}
              data-testid="button-save"
              title="Salvar agora"
              style={{ color: "#2b93ac" }}
            >
              <Save size={16} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleEditing}
            data-testid="button-edit-toggle"
            title={isEditing ? "Fechar editor" : "Editar slide"}
            style={{ color: isEditing ? "#2b93ac" : "#7a9eb5" }}
          >
            {isEditing ? <Check size={16} /> : <Pencil size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGrid(true)}
            data-testid="button-grid-view"
            style={{ color: "#7a9eb5" }}
          >
            <Grid size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            data-testid="button-fullscreen"
            style={{ color: "#7a9eb5" }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>

      <div className="h-1" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / totalSlides) * 100}%`,
            background: "linear-gradient(90deg, #1a6b82, #2b93ac)",
          }}
        />
      </div>
    </div>
  );
}
