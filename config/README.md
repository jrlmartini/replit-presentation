# Configuração — Conatus Slides

Base de configuração do projeto. Aqui ficam as referências do design system, documentação de tipos de slide, pipeline LLM, e instruções para gerenciar backgrounds e imagens padrão.

## Estrutura

```
config/
├── README.md                  ← Este arquivo
├── docs/
│   ├── design-system.md       ← Cores, tipografia, espaçamento, gradientes
│   ├── slide-types.md         ← 11 tipos de slide, componentes, regras de composição
│   ├── llm-pipeline.md        ← Pipeline de geração (planner → composer → images)
│   ├── backgrounds.md         ← Backgrounds dos slides, como substituir/adicionar
│   └── api-reference.md       ← Referência completa da API REST
└── assets/                    ← Diretório para assets fonte (PSDs, SVGs, etc.)
```

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
