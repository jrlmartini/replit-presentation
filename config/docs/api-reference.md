# Referência da API

## Base URL
Todas as rotas sob `/api/`.

---

## Endpoints

### Listar Decks
```
GET /api/decks
```
Retorna todos os decks sem `passwordHash`.

**Resposta**: `Deck[]` (sem campo `passwordHash`)

---

### Metadados do Deck
```
GET /api/deck/:id/meta
```
Retorna metadados públicos para verificar se precisa de senha.

**Resposta**:
```json
{ "id": "...", "title": "...", "isPasswordProtected": true }
```

---

### Desbloquear Deck
```
POST /api/deck/:id/unlock
Content-Type: application/json

{ "password": "string" }
```
Verifica a senha e retorna um token de acesso temporário (1h).

**Resposta**:
```json
{ "token": "uuid-v4", "expiresAt": "ISO-8601" }
```

---

### Obter Deck Completo
```
GET /api/deck/:id
GET /api/deck/:id?token=<access-token>
```
Retorna o deck completo com `deckAst`. Requer token se protegido por senha.

**Resposta**: `Deck` (sem campo `passwordHash`)

---

### Atualizar DeckAST
```
PATCH /api/deck/:id
PATCH /api/deck/:id?token=<access-token>
Content-Type: application/json

{ "deckAst": { ... } }
```
Atualiza a estrutura de slides do deck. Valida que `deckAst.slides` é array e `deckAst.meta.title` é string.

**Resposta**: `Deck` atualizado (sem `passwordHash`)

---

### Gerar Imagem por IA
```
POST /api/deck/:id/generate-image
POST /api/deck/:id/generate-image?token=<access-token>
Content-Type: application/json

{ "prompt": "string", "slideIndex": number, "componentIndex": number }
```
Gera uma imagem usando gpt-image-1 e retorna como data URI.

**Resposta**:
```json
{ "dataUri": "data:image/png;base64,..." }
```

---

### Gerar Deck
```
POST /api/generate
Content-Type: application/json

{ "title": "...", "subtitle": "...", "deckType": "...", ... }
```
Gera um novo deck completo a partir de um briefing. Executa o pipeline LLM (planner → composer → image gen).

**Resposta**: `Deck` recém-criado

---

## Autenticação

- Decks protegidos por senha requerem `?token=<access-token>` em todas as operações
- Token gerado via `POST /api/deck/:id/unlock`
- Token expira em 1 hora
- Token armazenado no `localStorage` do navegador como `deck-token-<id>`
