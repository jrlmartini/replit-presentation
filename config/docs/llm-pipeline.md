# Pipeline LLM — Referência

## Visão Geral

A geração de apresentações utiliza um pipeline de 3 etapas usando modelos OpenAI:

```
Briefing → [Step 1: Planner] → DeckPlan → [Step 2: Composer] → DeckAST → [Step 3: Image Gen] → DeckAST final
```

---

## Step 1 — Planner (gpt-5-mini)

**Entrada**: Briefing estruturado
**Saída**: `deck_plan` — sequência ordenada de slides

O Planner decide:
- Quais tipos de slide usar
- Ordem dos slides
- Título e subtítulo de cada slide
- Quais componentes cada slide terá

### Exemplo de saída
```json
{
  "deck_plan": [
    { "type": "cover", "title": "...", "subtitle": "..." },
    { "type": "agenda_light", "title": "Agenda" },
    { "type": "light_title_text_or_image", "title": "..." },
    { "type": "closing", "title": "Obrigado" }
  ]
}
```

---

## Step 2 — Composer (gpt-5-mini)

**Entrada**: `deck_plan` + Briefing original
**Saída**: `deck_ast` completo com todos os componentes

O Composer gera:
- Conteúdo textual de cada componente
- Estrutura completa do JSON (deckAst)
- Placeholders `[INSERIR DADO]` para informações que não deve inventar
- Placeholders `[INSERIR IMAGEM]` para imagens que serão geradas no Step 3

---

## Step 3 — Image Generator (gpt-image-1)

**Entrada**: `deck_ast` com placeholders de imagem
**Saída**: `deck_ast` com imagens em base64

Para cada `image_block` com `src: "[INSERIR IMAGEM]"`:
1. Gera prompt contextual baseado no título do slide e alt da imagem
2. Chama `gpt-image-1` (512x512, qualidade low)
3. Substitui o src pelo data URI base64
4. Retry com backoff exponencial em caso de falha

### Geração On-Demand (Editor)
- Endpoint: `POST /api/deck/:id/generate-image`
- Usa `gpt-image-1` com 1024x1024, qualidade medium
- Aceita prompt personalizado do usuário

---

## Configurações dos Modelos

| Parâmetro     | Planner      | Composer     | Image Gen     |
|---------------|--------------|--------------|---------------|
| Modelo        | gpt-5-mini   | gpt-5-mini   | gpt-image-1   |
| Temperatura   | 0.7          | 0.7          | n/a           |
| Max tokens    | 4000         | 8000         | n/a           |
| Resolução     | n/a          | n/a          | 512x512 (auto), 1024x1024 (on-demand) |

---

## Regras de Conteúdo

1. **Idioma**: Todo conteúdo gerado em pt-BR
2. **Dados**: Nunca inventar números, estatísticas ou dados — usar `[INSERIR DADO]`
3. **Imagens**: Usar `[INSERIR IMAGEM]` como placeholder para o Step 3
4. **Tom**: Seguir o tom definido no briefing (técnico-institucional, didático, comercial-leve, estratégico)
5. **Quantidade**: Respeitar o `slideCountTarget` do briefing (3-20 slides)
