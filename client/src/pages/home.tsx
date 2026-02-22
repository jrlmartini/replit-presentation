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
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <Layers size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-foreground font-bold text-xl tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Conatus Slides
              </h1>
              <p className="text-muted-foreground text-xs">
                Gerador de Apresentações
              </p>
            </div>
          </div>
          <Link href="/create">
            <Button data-testid="button-create-deck" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30">
              <PlusCircle size={16} className="mr-2" />
              Nova Apresentação
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2
            className="text-foreground font-bold tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.75rem", marginBottom: "0.5rem" }}
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
                className="animate-pulse rounded-xl bg-card/60 border border-white/[0.06]"
                style={{ height: "13rem" }}
              />
            ))}
          </div>
        ) : !decks || decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/[0.08] bg-card/30">
            <div
              className="flex items-center justify-center mb-5 rounded-2xl bg-primary/10 border border-primary/20"
              style={{ width: "4.5rem", height: "4.5rem" }}
            >
              <Presentation size={28} className="text-primary" />
            </div>
            <h3
              className="text-foreground font-semibold"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.25rem", marginBottom: "0.5rem" }}
            >
              Nenhuma apresentação criada
            </h3>
            <p className="text-muted-foreground mb-6" style={{ fontSize: "0.875rem", maxWidth: "26rem", textAlign: "center" }}>
              Crie sua primeira apresentação preenchendo o briefing com as informações do seu projeto.
            </p>
            <Link href="/create">
              <Button data-testid="button-create-first" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25">
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
                  className="group cursor-pointer rounded-xl transition-all duration-300 bg-card border border-white/[0.06] overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5"
                >
                  <div
                    className="h-32 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #061824 0%, #0c2a3e 50%, #143a52 100%)" }}
                  >
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: "url(/images/bg-cover.png)",
                        backgroundSize: "cover",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                      <p className="text-white font-bold leading-snug" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem" }}>
                        {deck.title}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                      {deck.isPasswordProtected && (
                        <div className="flex items-center gap-1">
                          <Lock size={11} />
                          <span>Protegido</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{new Date(deck.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Layers size={11} />
                        <span>{deck.slideCount || 0} slides</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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
