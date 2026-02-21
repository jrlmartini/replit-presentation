import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Presentation, Lock, Clock, ChevronRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Deck } from "@shared/schema";

export default function Home() {
  const { data: decks, isLoading } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
  });

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f5faf8 0%, #edf6f2 100%)" }}>
      <header
        className="border-b"
        style={{ borderColor: "#c8e0d5", backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "0.5rem",
                background: "linear-gradient(135deg, #1a7a5c, #22a87e)",
              }}
            >
              <Layers size={18} style={{ color: "#ffffff" }} />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#0f2a20",
                }}
              >
                Conatus Slides
              </h1>
              <p style={{ fontSize: "0.75rem", color: "#6b9e8c" }}>
                Gerador de Apresentações
              </p>
            </div>
          </div>
          <Link href="/create">
            <Button data-testid="button-create-deck" style={{ backgroundColor: "#1a7a5c", color: "#fff" }}>
              <PlusCircle size={16} className="mr-2" />
              Nova Apresentação
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#0f2a20",
              marginBottom: "0.5rem",
            }}
          >
            Suas Apresentações
          </h2>
          <p style={{ color: "#3a6b55", fontSize: "0.9375rem" }}>
            Crie apresentações profissionais da Conatus Ambiental de forma rápida e consistente.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="animate-pulse rounded-md"
                style={{
                  height: "12rem",
                  backgroundColor: "rgba(0,0,0,0.04)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            ))}
          </div>
        ) : !decks || decks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-md"
            style={{
              backgroundColor: "rgba(255,255,255,0.6)",
              border: "2px dashed #c8e0d5",
            }}
          >
            <div
              className="flex items-center justify-center mb-4"
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                backgroundColor: "rgba(26,122,92,0.08)",
              }}
            >
              <Presentation size={24} style={{ color: "#1a7a5c" }} />
            </div>
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#0f2a20",
                marginBottom: "0.5rem",
              }}
            >
              Nenhuma apresentação criada
            </h3>
            <p style={{ color: "#6b9e8c", fontSize: "0.875rem", marginBottom: "1.5rem", maxWidth: "24rem", textAlign: "center" }}>
              Crie sua primeira apresentação preenchendo o briefing com as informações do seu projeto.
            </p>
            <Link href="/create">
              <Button data-testid="button-create-first" style={{ backgroundColor: "#1a7a5c", color: "#fff" }}>
                <PlusCircle size={16} className="mr-2" />
                Criar Apresentação
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {decks.map(deck => (
              <Link key={deck.id} href={`/deck/${deck.id}`}>
                <div
                  data-testid={`card-deck-${deck.id}`}
                  className="group cursor-pointer rounded-md transition-all duration-200"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    border: "1px solid #c8e0d5",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="h-32 relative"
                    style={{
                      background: "linear-gradient(135deg, #0a1f17, #143d2e, #1a5040)",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: "url(/images/bg-cover.png)",
                        backgroundSize: "cover",
                        opacity: 0.25,
                      }}
                    />
                    <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                      <p
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          lineHeight: 1.3,
                        }}
                      >
                        {deck.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {deck.isPasswordProtected && (
                        <div className="flex items-center gap-1" style={{ color: "#6b9e8c", fontSize: "0.75rem" }}>
                          <Lock size={12} />
                          <span>Protegido</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1" style={{ color: "#6b9e8c", fontSize: "0.75rem" }}>
                        <Clock size={12} />
                        <span>{new Date(deck.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: "#6b9e8c", fontSize: "0.75rem" }}>
                        <Layers size={12} />
                        <span>{deck.slideCount || 0} slides</span>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: "#6b9e8c" }} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
