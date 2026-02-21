# Backgrounds e Imagens Padrão

## Localização dos Arquivos

Todos os backgrounds ficam em: `client/public/images/`

Estes arquivos são servidos estaticamente e referenciados nos slides como `/images/<nome>.png`.

---

## Backgrounds Atuais

| Arquivo           | Dimensão Recomendada | Usado em                 | Descrição                                   |
|-------------------|----------------------|--------------------------|----------------------------------------------|
| `bg-cover.png`    | 1920x1080            | Slide `cover`            | Textura/padrão para slide de capa            |
| `bg-closing.png`  | 1920x1080            | Slide `closing`          | Textura/padrão para slide de encerramento    |
| `bg-section.png`  | 1920x1080            | Slide `section_divider`  | Textura/padrão para separadores de seção     |
| `bg-dark.png`     | 1920x1080            | Slides dark (conteúdo)   | Textura/padrão para slides com fundo escuro  |
| `bg-light.png`    | 1920x1080            | Slides light (conteúdo)  | Textura/padrão para slides com fundo claro   |

---

## Como os Backgrounds São Aplicados

Os backgrounds são renderizados como camada de fundo com opacidade reduzida:

- **Slides escuros**: `opacity: 0.3` — textura sutil sobre o gradiente escuro
- **Slides claros**: `opacity: 0.15` — textura muito sutil sobre o fundo branco

O background é posicionado com `background-size: cover` e `background-position: center`.

---

## Substituindo Backgrounds

Para trocar um background:

1. Crie a imagem no formato **PNG** com dimensão **1920x1080** (16:9)
2. Use padrões/texturas sutis (linhas, formas geométricas, patterns)
3. Evite imagens muito detalhadas — elas aparecerão com opacidade reduzida
4. Mantenha o mesmo nome de arquivo ao substituir
5. Coloque o arquivo em `client/public/images/`

### Recomendações de Design
- Use tons de verde (Conatus) nas texturas
- Prefira padrões abstratos ou geométricos
- Evite texto nas imagens de fundo
- Considere a legibilidade: o conteúdo do slide será exibido sobre o background
- Teste em ambos os modos (dark e light) se o background for compartilhado

---

## Adicionando Novos Backgrounds

Para adicionar um novo background personalizado:

1. Adicione o arquivo PNG em `client/public/images/`
2. Referencie no componente do slide correspondente em `client/src/components/slides/`
3. Use o padrão: `backgroundImage: "url(/images/seu-arquivo.png)"`

---

## Logo e Marca

Se precisar adicionar logo da Conatus Ambiental:
- Local: `client/public/images/logo-conatus.png`
- Formato: PNG com fundo transparente
- Tamanho recomendado: 300x100 (horizontal) ou 200x200 (quadrado)
