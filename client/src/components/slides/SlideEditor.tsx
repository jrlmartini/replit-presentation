import { useState } from "react";
import { X, Plus, Trash2, Sparkles, Save, Loader2, ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Slide, SlideComponent, DeckAst } from "@shared/schema";

interface SlideEditorProps {
  slide: Slide;
  slideIndex: number;
  deckAst: DeckAst;
  deckId: string;
  token: string | null;
  onUpdate: (updatedAst: DeckAst) => void;
  onClose: () => void;
  onGenerateImage: (prompt: string, slideIndex: number, componentIndex: number) => Promise<string | null>;
  isSaving: boolean;
}

export function SlideEditor({
  slide,
  slideIndex,
  deckAst,
  deckId,
  token,
  onUpdate,
  onClose,
  onGenerateImage,
  isSaving,
}: SlideEditorProps) {
  const [generatingImage, setGeneratingImage] = useState<number | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [showImagePrompt, setShowImagePrompt] = useState<number | null>(null);

  const updateSlideField = (field: keyof Slide, value: any) => {
    const newAst = { ...deckAst };
    const newSlides = [...newAst.slides];
    newSlides[slideIndex] = { ...newSlides[slideIndex], [field]: value };
    newAst.slides = newSlides;
    onUpdate(newAst);
  };

  const updateComponent = (compIndex: number, newContent: any) => {
    const newAst = { ...deckAst };
    const newSlides = [...newAst.slides];
    const newComponents = [...newSlides[slideIndex].components];
    newComponents[compIndex] = { ...newComponents[compIndex], content: newContent };
    newSlides[slideIndex] = { ...newSlides[slideIndex], components: newComponents };
    newAst.slides = newSlides;
    onUpdate(newAst);
  };

  const removeComponent = (compIndex: number) => {
    const newAst = { ...deckAst };
    const newSlides = [...newAst.slides];
    const newComponents = newSlides[slideIndex].components.filter((_, i) => i !== compIndex);
    newSlides[slideIndex] = { ...newSlides[slideIndex], components: newComponents };
    newAst.slides = newSlides;
    onUpdate(newAst);
  };

  const addComponent = (type: string) => {
    const newAst = { ...deckAst };
    const newSlides = [...newAst.slides];
    const existingComps = newSlides[slideIndex].components;
    const newComp: SlideComponent = {
      id: `comp-${slideIndex + 1}-${existingComps.length + 1}`,
      componentType: type as any,
      content: type === "text_block" ? "Novo texto" :
        type === "bullet_list" ? ["Item 1"] :
        type === "image_block" ? { src: "[INSERIR IMAGEM]", alt: "Nova imagem" } :
        type === "agenda_list" ? ["Item 1"] :
        type === "contact_block" ? { name: "Conatus Ambiental", email: "[INSERIR EMAIL]" } :
        type === "tag" ? "TAG" :
        type === "divider_label" ? "Seção" :
        type === "icon_feature_item" ? { iconName: "sparkles", title: "Novo Feature", text: "Descrição do feature" } :
        "Texto",
    };
    newSlides[slideIndex] = { ...newSlides[slideIndex], components: [...existingComps, newComp] };
    newAst.slides = newSlides;
    onUpdate(newAst);
  };

  const handleGenerateImage = async (compIndex: number) => {
    if (!imagePrompt.trim()) return;
    setGeneratingImage(compIndex);
    try {
      const dataUri = await onGenerateImage(imagePrompt, slideIndex, compIndex);
      if (dataUri) {
        updateComponent(compIndex, { src: dataUri, alt: imagePrompt });
      }
    } finally {
      setGeneratingImage(null);
      setShowImagePrompt(null);
      setImagePrompt("");
    }
  };

  const handleImageUpload = (compIndex: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      updateComponent(compIndex, { src: dataUri, alt: file.name });
    };
    reader.readAsDataURL(file);
  };

  const renderComponentEditor = (comp: SlideComponent, compIndex: number) => {
    switch (comp.componentType) {
      case "text_block":
        return (
          <div key={comp.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs" style={{ color: "#a8cfc0" }}>Texto</Label>
              <Button variant="ghost" size="icon" onClick={() => removeComponent(compIndex)} className="h-6 w-6">
                <Trash2 size={12} style={{ color: "#ef4444" }} />
              </Button>
            </div>
            <Textarea
              data-testid={`editor-text-${compIndex}`}
              value={typeof comp.content === "string" ? comp.content : ""}
              onChange={(e) => updateComponent(compIndex, e.target.value)}
              className="min-h-[80px] text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
            />
          </div>
        );

      case "bullet_list":
      case "agenda_list": {
        const items = Array.isArray(comp.content) ? comp.content : [];
        return (
          <div key={comp.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs" style={{ color: "#a8cfc0" }}>
                {comp.componentType === "bullet_list" ? "Lista" : "Agenda"}
              </Label>
              <Button variant="ghost" size="icon" onClick={() => removeComponent(compIndex)} className="h-6 w-6">
                <Trash2 size={12} style={{ color: "#ef4444" }} />
              </Button>
            </div>
            {items.map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-1">
                <span className="text-xs w-5 text-center" style={{ color: "#6b9e8c" }}>{i + 1}</span>
                <Input
                  data-testid={`editor-list-item-${compIndex}-${i}`}
                  value={item}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[i] = e.target.value;
                    updateComponent(compIndex, newItems);
                  }}
                  className="text-sm h-8"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
                />
                <Button
                  variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0"
                  onClick={() => {
                    const newItems = items.filter((_: string, j: number) => j !== i);
                    updateComponent(compIndex, newItems);
                  }}
                >
                  <Trash2 size={10} style={{ color: "#ef4444" }} />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost" size="sm"
              onClick={() => updateComponent(compIndex, [...items, "Novo item"])}
              className="w-full h-7 text-xs"
              style={{ color: "#22a87e", borderColor: "rgba(34,168,126,0.3)", border: "1px dashed" }}
            >
              <Plus size={12} className="mr-1" /> Adicionar item
            </Button>
          </div>
        );
      }

      case "image_block": {
        const imgContent = typeof comp.content === "object" && comp.content
          ? comp.content as { src?: string; alt?: string }
          : { src: "", alt: "" };
        const hasImage = imgContent.src && imgContent.src !== "[INSERIR IMAGEM]";
        return (
          <div key={comp.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs" style={{ color: "#a8cfc0" }}>Imagem</Label>
              <Button variant="ghost" size="icon" onClick={() => removeComponent(compIndex)} className="h-6 w-6">
                <Trash2 size={12} style={{ color: "#ef4444" }} />
              </Button>
            </div>
            {hasImage && (
              <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(42,90,72,0.3)" }}>
                <img src={imgContent.src} alt={imgContent.alt} className="w-full h-24 object-cover" />
              </div>
            )}
            <Input
              data-testid={`editor-image-alt-${compIndex}`}
              value={imgContent.alt || ""}
              onChange={(e) => updateComponent(compIndex, { ...imgContent, alt: e.target.value })}
              placeholder="Descrição da imagem"
              className="text-sm h-8"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
            />
            <Input
              data-testid={`editor-image-url-${compIndex}`}
              value={imgContent.src === "[INSERIR IMAGEM]" ? "" : (imgContent.src?.startsWith("data:") ? "" : imgContent.src || "")}
              onChange={(e) => updateComponent(compIndex, { ...imgContent, src: e.target.value || "[INSERIR IMAGEM]" })}
              placeholder="URL da imagem (ou use IA/upload)"
              className="text-sm h-8"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
            />
            <div className="flex gap-1">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(compIndex, file);
                  }}
                />
                <div
                  className="flex items-center justify-center gap-1 h-8 rounded cursor-pointer text-xs transition-colors hover:opacity-80"
                  style={{ backgroundColor: "rgba(42,90,72,0.3)", color: "#a8cfc0", border: "1px solid rgba(42,90,72,0.4)" }}
                  data-testid={`editor-image-upload-${compIndex}`}
                >
                  <Upload size={12} /> Upload
                </div>
              </label>
              <Button
                variant="ghost" size="sm"
                className="flex-1 h-8 text-xs"
                style={{ backgroundColor: "rgba(34,168,126,0.15)", color: "#22a87e", border: "1px solid rgba(34,168,126,0.3)" }}
                onClick={() => {
                  setShowImagePrompt(compIndex);
                  setImagePrompt(imgContent.alt || slide.title || "");
                }}
                data-testid={`editor-image-ai-${compIndex}`}
              >
                <Sparkles size={12} className="mr-1" /> Gerar com IA
              </Button>
            </div>
            {showImagePrompt === compIndex && (
              <div className="space-y-2 p-2 rounded" style={{ backgroundColor: "rgba(34,168,126,0.1)", border: "1px solid rgba(34,168,126,0.2)" }}>
                <Textarea
                  data-testid={`editor-image-prompt-${compIndex}`}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Descreva a imagem que deseja gerar..."
                  className="min-h-[60px] text-sm"
                  style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "#e8f5f0", borderColor: "rgba(34,168,126,0.3)" }}
                />
                <div className="flex gap-1">
                  <Button
                    size="sm" className="flex-1 h-7 text-xs"
                    style={{ backgroundColor: "#22a87e", color: "#fff" }}
                    onClick={() => handleGenerateImage(compIndex)}
                    disabled={generatingImage !== null}
                    data-testid={`editor-image-generate-${compIndex}`}
                  >
                    {generatingImage === compIndex ? (
                      <><Loader2 size={12} className="mr-1 animate-spin" /> Gerando...</>
                    ) : (
                      <><Sparkles size={12} className="mr-1" /> Gerar</>
                    )}
                  </Button>
                  <Button
                    variant="ghost" size="sm" className="h-7 text-xs"
                    onClick={() => { setShowImagePrompt(null); setImagePrompt(""); }}
                    style={{ color: "#6b9e8c" }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      }

      case "contact_block": {
        const contact = typeof comp.content === "object" && comp.content
          ? comp.content as Record<string, string>
          : {};
        const fields = [
          { key: "name", label: "Nome" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Telefone" },
          { key: "website", label: "Website" },
        ];
        return (
          <div key={comp.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs" style={{ color: "#a8cfc0" }}>Contato</Label>
              <Button variant="ghost" size="icon" onClick={() => removeComponent(compIndex)} className="h-6 w-6">
                <Trash2 size={12} style={{ color: "#ef4444" }} />
              </Button>
            </div>
            {fields.map(({ key, label }) => (
              <div key={key}>
                <Label className="text-[10px]" style={{ color: "#6b9e8c" }}>{label}</Label>
                <Input
                  data-testid={`editor-contact-${key}-${compIndex}`}
                  value={contact[key] || ""}
                  onChange={(e) => updateComponent(compIndex, { ...contact, [key]: e.target.value })}
                  className="text-sm h-7"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
                />
              </div>
            ))}
          </div>
        );
      }

      case "chart_block": {
        const chartData = typeof comp.content === "object" && comp.content
          ? comp.content as { chartType?: string; title?: string; data?: Array<{ name: string; value: number }> }
          : { chartType: "bar", title: "", data: [] };
        return (
          <div key={comp.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs" style={{ color: "#a8cfc0" }}>Gráfico</Label>
              <Button variant="ghost" size="icon" onClick={() => removeComponent(compIndex)} className="h-6 w-6">
                <Trash2 size={12} style={{ color: "#ef4444" }} />
              </Button>
            </div>
            <Input
              data-testid={`editor-chart-title-${compIndex}`}
              value={chartData.title || ""}
              onChange={(e) => updateComponent(compIndex, { ...chartData, title: e.target.value })}
              placeholder="Título do gráfico"
              className="text-sm h-8"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
            />
            {(chartData.data || []).map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <Input
                  value={item.name}
                  onChange={(e) => {
                    const newData = [...(chartData.data || [])];
                    newData[i] = { ...newData[i], name: e.target.value };
                    updateComponent(compIndex, { ...chartData, data: newData });
                  }}
                  className="text-sm h-7 flex-1"
                  placeholder="Rótulo"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
                />
                <Input
                  type="number"
                  value={item.value}
                  onChange={(e) => {
                    const newData = [...(chartData.data || [])];
                    newData[i] = { ...newData[i], value: parseFloat(e.target.value) || 0 };
                    updateComponent(compIndex, { ...chartData, data: newData });
                  }}
                  className="text-sm h-7 w-20"
                  placeholder="Valor"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
                />
                <Button variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => {
                    const newData = (chartData.data || []).filter((_, j) => j !== i);
                    updateComponent(compIndex, { ...chartData, data: newData });
                  }}
                >
                  <Trash2 size={10} style={{ color: "#ef4444" }} />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost" size="sm"
              onClick={() => updateComponent(compIndex, { ...chartData, data: [...(chartData.data || []), { name: "Novo", value: 0 }] })}
              className="w-full h-7 text-xs"
              style={{ color: "#22a87e", borderColor: "rgba(34,168,126,0.3)", border: "1px dashed" }}
            >
              <Plus size={12} className="mr-1" /> Adicionar dado
            </Button>
          </div>
        );
      }

      case "icon_feature_item": {
        const iconContent = typeof comp.content === "object" && comp.content
          ? comp.content as { iconName?: string; title?: string; text?: string }
          : { iconName: "", title: "", text: "" };
        return (
          <div key={comp.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs" style={{ color: "#a8cfc0" }}>Feature com Ícone</Label>
              <Button variant="ghost" size="icon" onClick={() => removeComponent(compIndex)} className="h-6 w-6">
                <Trash2 size={12} style={{ color: "#ef4444" }} />
              </Button>
            </div>
            <Input
              data-testid={`editor-icon-name-${compIndex}`}
              value={iconContent.iconName || ""}
              onChange={(e) => updateComponent(compIndex, { ...iconContent, iconName: e.target.value })}
              placeholder="Nome do ícone (ex: shield-check, leaf)"
              className="text-sm h-8"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
            />
            <Input
              data-testid={`editor-icon-title-${compIndex}`}
              value={iconContent.title || ""}
              onChange={(e) => updateComponent(compIndex, { ...iconContent, title: e.target.value })}
              placeholder="Título do feature"
              className="text-sm h-8"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
            />
            <Textarea
              data-testid={`editor-icon-text-${compIndex}`}
              value={iconContent.text || ""}
              onChange={(e) => updateComponent(compIndex, { ...iconContent, text: e.target.value })}
              placeholder="Descrição do feature"
              className="min-h-[50px] text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
            />
          </div>
        );
      }

      case "tag":
      case "divider_label":
        return (
          <div key={comp.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs" style={{ color: "#a8cfc0" }}>
                {comp.componentType === "tag" ? "Tag" : "Rótulo"}
              </Label>
              <Button variant="ghost" size="icon" onClick={() => removeComponent(compIndex)} className="h-6 w-6">
                <Trash2 size={12} style={{ color: "#ef4444" }} />
              </Button>
            </div>
            <Input
              data-testid={`editor-${comp.componentType}-${compIndex}`}
              value={typeof comp.content === "string" ? comp.content : ""}
              onChange={(e) => updateComponent(compIndex, e.target.value)}
              className="text-sm h-8"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const componentTypes = [
    { type: "text_block", label: "Texto" },
    { type: "bullet_list", label: "Lista" },
    { type: "image_block", label: "Imagem" },
    { type: "agenda_list", label: "Agenda" },
    { type: "contact_block", label: "Contato" },
    { type: "chart_block", label: "Gráfico" },
    { type: "tag", label: "Tag" },
    { type: "icon_feature_item", label: "Feature" },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: "#0f1f1a",
        borderLeft: "1px solid rgba(42,90,72,0.4)",
        width: "360px",
        minWidth: "360px",
      }}
    >
      <div className="flex items-center justify-between p-3" style={{ borderBottom: "1px solid rgba(42,90,72,0.3)" }}>
        <h3 style={{ color: "#e8f5f0", fontSize: "0.875rem", fontWeight: 600 }}>
          Editar Slide {slideIndex + 1}
        </h3>
        <div className="flex items-center gap-1">
          {isSaving && <Loader2 size={14} className="animate-spin" style={{ color: "#22a87e" }} />}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7" data-testid="button-close-editor">
            <X size={16} style={{ color: "#a8cfc0" }} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs" style={{ color: "#a8cfc0" }}>Título do Slide</Label>
          <Input
            data-testid="editor-slide-title"
            value={slide.title || ""}
            onChange={(e) => updateSlideField("title", e.target.value)}
            className="text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs" style={{ color: "#a8cfc0" }}>Subtítulo</Label>
          <Input
            data-testid="editor-slide-subtitle"
            value={slide.subtitle || ""}
            onChange={(e) => updateSlideField("subtitle", e.target.value)}
            className="text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
          />
        </div>

        <div style={{ borderTop: "1px solid rgba(42,90,72,0.2)", paddingTop: "0.75rem" }}>
          <Label className="text-xs" style={{ color: "#a8cfc0", marginBottom: "0.5rem", display: "block" }}>
            Componentes ({slide.components.length})
          </Label>
          <div className="space-y-3">
            {slide.components.map((comp, i) => (
              <div key={comp.id} className="p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(42,90,72,0.2)" }}>
                {comp.slot && (
                  <div className="mb-1">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: "rgba(34,168,126,0.15)", color: "#6b9e8c", border: "1px solid rgba(34,168,126,0.2)" }}
                    >
                      slot: {comp.slot}
                    </span>
                  </div>
                )}
                {renderComponentEditor(comp, i)}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(42,90,72,0.2)", paddingTop: "0.75rem" }}>
          <Label className="text-xs" style={{ color: "#6b9e8c", marginBottom: "0.5rem", display: "block" }}>
            Adicionar Componente
          </Label>
          <div className="flex flex-wrap gap-1">
            {componentTypes.map(({ type, label }) => (
              <Button
                key={type}
                variant="ghost" size="sm"
                onClick={() => addComponent(type)}
                className="h-7 text-xs"
                style={{ color: "#22a87e", border: "1px solid rgba(34,168,126,0.2)" }}
                data-testid={`editor-add-${type}`}
              >
                <Plus size={10} className="mr-1" /> {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs" style={{ color: "#a8cfc0" }}>Notas do Slide</Label>
          <Textarea
            data-testid="editor-slide-notes"
            value={slide.notes || ""}
            onChange={(e) => updateSlideField("notes", e.target.value)}
            placeholder="Notas de apresentação (não visíveis no slide)"
            className="min-h-[60px] text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e8f5f0", borderColor: "rgba(42,90,72,0.4)" }}
          />
        </div>
      </div>
    </div>
  );
}
