# Configuração — Conatus Slides

Base de configuração do projeto. Aqui ficam as referências do design system, documentação de tipos de slide, pipeline LLM, guias editoriais e instruções para gerenciar backgrounds e imagens padrão.

## Estrutura

```
config/
├── README.md                        ← Este arquivo
├── docs/
│   ├── design-system.md             ← Cores, tipografia, espaçamento, gradientes
│   ├── slide-types.md               ← 11 tipos de slide, componentes, regras de composição
│   ├── llm-pipeline.md              ← Pipeline de geração (planner → composer → images)
│   ├── backgrounds.md               ← Backgrounds dos slides, como substituir/adicionar
│   ├── api-reference.md             ← Referência completa da API REST
│   ├── presentation-agent-rules.md  ← Regras globais do agente (usado pelo LLM) ★
│   ├── content-style-guide.md       ← Guia de estilo editorial (usado pelo LLM) ★
│   └── slide-selection-guide.md     ← Guia de seleção de slides (usado pelo LLM) ★
└── assets/                          ← Assets fonte (PSDs, SVGs, logos)
```

★ = Integrados nos prompts do pipeline LLM (planner + composer)

## Guias do LLM (Alimentam o Pipeline)

Estes 3 arquivos são injetados nos prompts do LLM para garantir qualidade e consistência:

| Arquivo                          | Usado em         | Propósito                                    |
|----------------------------------|------------------|----------------------------------------------|
| `presentation-agent-rules.md`    | Planner+Composer | Regras globais: tom, precisão, placeholders   |
| `content-style-guide.md`        | Composer         | Estilo de escrita: títulos, bullets, texto     |
| `slide-selection-guide.md`      | Planner          | Quando usar cada tipo de slide, sequências     |

## Arquivos de Código Relacionados

| Arquivo                      | Descrição                              |
|------------------------------|----------------------------------------|
| `shared/theme-conatus.ts`    | Tokens do tema (cores, fontes, etc.)   |
| `shared/slide-types.ts`      | Registro dos 11 tipos de slide         |
| `shared/schema.ts`           | Schemas Zod e tabela do banco          |
| `server/llm-pipeline.ts`     | Pipeline LLM completo                  |
| `client/public/images/`      | Backgrounds dos slides (PNG)           |

## Links Rápidos

- [Design System](docs/design-system.md) — paleta de cores, tipografia, espaçamento
- [Tipos de Slide](docs/slide-types.md) — referência dos 11 templates
- [Pipeline LLM](docs/llm-pipeline.md) — como a geração funciona
- [Backgrounds](docs/backgrounds.md) — como trocar/adicionar backgrounds
- [API](docs/api-reference.md) — endpoints REST
- [Regras do Agente](docs/presentation-agent-rules.md) — comportamento do LLM
- [Guia de Estilo](docs/content-style-guide.md) — como escrever conteúdo
- [Seleção de Slides](docs/slide-selection-guide.md) — como escolher tipos de slide
