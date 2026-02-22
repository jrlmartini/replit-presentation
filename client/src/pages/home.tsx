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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-lg bg-primary"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <Layers size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-foreground" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.25rem", fontWeight: 700 }}>
                Conatus Slides
              </h1>
              <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                Gerador de Apresentações
              </p>
            </div>
          </div>
          <Link href="/create">
            <Button data-testid="button-create-deck" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle size={16} className="mr-2" />
              Nova Apresentação
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2
            className="text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}
          >
            Suas Apresentações
          </h2>
          <p className="text-muted-foreground" style={{ fontSize: "0.9375rem" }}>
            Crie apresentações profissionais da Conatus Ambiental de forma rápida e consistente.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="animate-pulse rounded-md bg-muted border border-border"
                style={{ height: "12rem" }}
              />
            ))}
          </div>
        ) : !decks || decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-md border-2 border-dashed border-border bg-card/60">
            <div
              className="flex items-center justify-center mb-4 rounded-full bg-primary/10"
              style={{ width: "4rem", height: "4rem" }}
            >
              <Presentation size={24} className="text-primary" />
            </div>
            <h3
              className="text-foreground"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}
            >
              Nenhuma apresentação criada
            </h3>
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem", marginBottom: "1.5rem", maxWidth: "24rem", textAlign: "center" }}>
              Crie sua primeira apresentação preenchendo o briefing com as informações do seu projeto.
            </p>
            <Link href="/create">
              <Button data-testid="button-create-first" className="bg-primary text-primary-foreground hover:bg-primary/90">
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
                  className="group cursor-pointer rounded-md transition-all duration-200 bg-card border border-border overflow-hidden hover:border-primary/40"
                >
                  <div
                    className="h-32 relative"
                    style={{ background: "linear-gradient(135deg, #0a1520, #132a3d, #1a3a50)" }}
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
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>
                        {deck.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {deck.isPasswordProtected && (
                        <div className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                          <Lock size={12} />
                          <span>Protegido</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                        <Clock size={12} />
                        <span>{new Date(deck.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                        <Layers size={12} />
                        <span>{deck.slideCount || 0} slides</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
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
