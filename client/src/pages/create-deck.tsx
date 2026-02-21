import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { briefingSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Layers, Sparkles, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";

export default function CreateDeck() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof briefingSchema>>({
    resolver: zodResolver(briefingSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      deckType: "projeto",
      audience: "",
      objective: "",
      tone: "tecnico-institucional",
      slideCountTarget: 8,
      structure: {
        includeAgenda: true,
        includeSectionDividers: true,
        allowLightSlides: true,
        allowDarkSlides: true,
      },
      promptNotes: "",
      password: "",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof briefingSchema>) => {
      const res = await apiRequest("POST", "/api/generate", values);
      return res.json();
    },
    onSuccess: (data: { deckId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/decks"] });
      toast({
        title: "Apresentação gerada!",
        description: "Sua apresentação foi criada com sucesso.",
      });
      setLocation(`/deck/${data.deckId}`);
    },
    onError: (err: Error) => {
      toast({
        title: "Erro ao gerar",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof briefingSchema>) => {
    generateMutation.mutate(values);
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f5faf8 0%, #edf6f2 100%)" }}>
      <header
        className="border-b"
        style={{ borderColor: "#c8e0d5", backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.375rem",
                background: "linear-gradient(135deg, #1a7a5c, #22a87e)",
              }}
            >
              <Layers size={14} style={{ color: "#fff" }} />
            </div>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "#0f2a20",
              }}
            >
              Nova Apresentação
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {generateMutation.isPending && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
            style={{ backgroundColor: "rgba(15, 31, 26, 0.92)" }}
          >
            <Loader2 size={40} className="animate-spin" style={{ color: "#22a87e" }} />
            <div className="text-center">
              <p style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Gerando apresentação...
              </p>
              <p style={{ color: "#a8cfc0", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                O LLM está construindo seus slides. Isso pode levar até 30 segundos.
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <section
              className="rounded-md p-6"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                border: "1px solid #c8e0d5",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={18} style={{ color: "#1a7a5c" }} />
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.125rem", fontWeight: 700, color: "#0f2a20" }}>
                  Briefing da Apresentação
                </h2>
              </div>

              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input data-testid="input-title" placeholder="Ex: Plano de Gestão Ambiental – Obra XYZ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo</FormLabel>
                      <FormControl>
                        <Input data-testid="input-subtitle" placeholder="Linha auxiliar (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="deckType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Deck</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-deck-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="treinamento">Treinamento</SelectItem>
                            <SelectItem value="projeto">Projeto</SelectItem>
                            <SelectItem value="diretoria">Diretoria</SelectItem>
                            <SelectItem value="cliente">Cliente</SelectItem>
                            <SelectItem value="institucional">Institucional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tom</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-tone">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tecnico-institucional">Técnico-Institucional</SelectItem>
                            <SelectItem value="didatico">Didático</SelectItem>
                            <SelectItem value="comercial-leve">Comercial Leve</SelectItem>
                            <SelectItem value="estrategico">Estratégico</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Público-alvo</FormLabel>
                      <FormControl>
                        <Input data-testid="input-audience" placeholder="Ex: Equipe técnica de campo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo</FormLabel>
                      <FormControl>
                        <Textarea data-testid="input-objective" placeholder="O que esta apresentação deve comunicar?" rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slideCountTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade de Slides: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          data-testid="slider-slide-count"
                          min={3}
                          max={20}
                          step={1}
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                        />
                      </FormControl>
                      <FormDescription>De 3 a 20 slides (meta sugerida)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section
              className="rounded-md p-6"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                border: "1px solid #c8e0d5",
              }}
            >
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#0f2a20", marginBottom: "1rem" }}>
                Estrutura dos Slides
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(["includeAgenda", "includeSectionDividers", "allowLightSlides", "allowDarkSlides"] as const).map(key => {
                  const labels: Record<string, string> = {
                    includeAgenda: "Incluir Agenda",
                    includeSectionDividers: "Separadores de Seção",
                    allowLightSlides: "Slides Claros",
                    allowDarkSlides: "Slides Escuros",
                  };
                  return (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`structure.${key}`}
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 rounded" style={{ border: "1px solid #e0ede6" }}>
                          <FormLabel className="cursor-pointer">{labels[key]}</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  );
                })}
              </div>
            </section>

            <section
              className="rounded-md p-6"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                border: "1px solid #c8e0d5",
              }}
            >
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#0f2a20", marginBottom: "1rem" }}>
                Notas Livres para a IA
              </h3>
              <FormField
                control={form.control}
                name="promptNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        data-testid="input-prompt-notes"
                        placeholder="Instruções adicionais para o gerador de slides. Ex: 'Enfatizar indicadores de biodiversidade', 'Incluir slide sobre cronograma'"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Campo livre para orientar a geração dos slides</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section
              className="rounded-md p-6"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                border: "1px solid #c8e0d5",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} style={{ color: "#1a7a5c" }} />
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#0f2a20" }}>
                  Proteção por Senha
                </h3>
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha de Acesso *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          data-testid="input-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 4 caracteres"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff size={16} style={{ color: "#6b9e8c" }} /> : <Eye size={16} style={{ color: "#6b9e8c" }} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription>Cada apresentação é protegida por senha individual</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <Button
              type="submit"
              data-testid="button-submit-generate"
              disabled={generateMutation.isPending}
              className="w-full h-12 text-base font-semibold"
              style={{ backgroundColor: "#1a7a5c", color: "#fff" }}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Gerando Apresentação...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="mr-2" />
                  Gerar Apresentação
                </>
              )}
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
}
