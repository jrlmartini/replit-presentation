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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0a1f17 0%, #0f2d22 40%, #143d2e 100%)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/bg-cover.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }}
      />
      <div
        className="relative z-10 w-full max-w-md p-8 rounded-lg"
        style={{
          backgroundColor: "rgba(20, 43, 35, 0.8)",
          border: "1px solid rgba(42, 90, 72, 0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center mb-4"
            style={{
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "50%",
              backgroundColor: "rgba(34, 168, 126, 0.15)",
              border: "2px solid rgba(34, 168, 126, 0.3)",
            }}
          >
            <Lock size={22} style={{ color: "#22a87e" }} />
          </div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "1.375rem",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "0.375rem",
            }}
          >
            Apresentação Protegida
          </h2>
          {deckTitle && (
            <p style={{ color: "#a8cfc0", fontSize: "0.875rem", textAlign: "center" }}>
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
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#e8f5f0",
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} style={{ color: "#6b9e8c" }} /> : <Eye size={16} style={{ color: "#6b9e8c" }} />}
            </button>
          </div>
          <Button
            type="submit"
            data-testid="button-unlock"
            disabled={unlockMutation.isPending || password.length < 4}
            className="w-full"
            style={{ backgroundColor: "#1a7a5c", color: "#fff" }}
          >
            {unlockMutation.isPending ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Lock size={16} className="mr-2" />
            )}
            Desbloquear
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2" style={{ color: "#6b9e8c", fontSize: "0.75rem" }}>
          <Layers size={12} />
          <span>Conatus Slides</span>
        </div>
      </div>
    </div>
  );
}
