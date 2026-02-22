import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2, Eye, EyeOff, Layers } from "lucide-react";

interface DeckUnlockProps {
  deckId: string;
  deckTitle?: string;
  onUnlock: (token: string) => void;
}

export function DeckUnlock({ deckId, deckTitle, onUnlock }: DeckUnlockProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const unlockMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const res = await apiRequest("POST", `/api/deck/${deckId}/unlock`, { password: pwd });
      return res.json();
    },
    onSuccess: (data: { token: string }) => {
      onUnlock(data.token);
    },
    onError: () => {
      toast({
        title: "Senha incorreta",
        description: "Verifique a senha e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) return;
    unlockMutation.mutate(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(199 60% 15% / 0.4) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(/images/bg-cover.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-card/80 border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/40">
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center mb-5 rounded-2xl bg-primary/15 border border-primary/25 shadow-lg shadow-primary/10"
            style={{ width: "3.5rem", height: "3.5rem" }}
          >
            <Lock size={22} className="text-primary" />
          </div>
          <h2
            className="text-foreground font-bold"
            style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.375rem", marginBottom: "0.375rem" }}
          >
            Apresentação Protegida
          </h2>
          {deckTitle && (
            <p className="text-muted-foreground text-sm text-center">
              {deckTitle}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              data-testid="input-unlock-password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Button
            type="submit"
            data-testid="button-unlock"
            disabled={unlockMutation.isPending || password.length < 4}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25 rounded-xl font-semibold"
          >
            {unlockMutation.isPending ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Lock size={16} className="mr-2" />
            )}
            Desbloquear
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground" style={{ fontSize: "0.75rem" }}>
          <Layers size={12} />
          <span>Conatus Slides</span>
        </div>
      </div>
    </div>
  );
}
