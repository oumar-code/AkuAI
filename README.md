# AkuAI

Aku AI is a microservice in the Aku platform ecosystem. It provides AI-powered features, inference, and automation for users and other services via a scalable Node.js REST API.

## Features

- **REST API** for AI/ML tasks (inference, text generation, classification, summarization)
- **Scalable Node.js backend** built with Express
- **Input validation** via Joi schemas
- **Rate limiting** to protect against abuse
- **Structured error handling** with consistent JSON responses

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

| Variable               | Default | Description                              |
| ---------------------- | ------- | ---------------------------------------- |
| `PORT`                 | `3000`  | Port the HTTP server listens on          |
| `NODE_ENV`             | `development` | Runtime environment               |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate-limit window in milliseconds        |
| `RATE_LIMIT_MAX`       | `100`   | Max requests per window per IP           |

### Running

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

## API Reference

### Health Check

```
GET /health
```

Response:
```json
{ "status": "ok", "service": "aku-ai", "timestamp": "2026-01-01T00:00:00.000Z" }
```

---

### List Models

```
GET /api/models
```

Response:
```json
{
  "status": "ok",
  "count": 3,
  "models": [
    { "id": "text-gen-v1", "name": "Text Generation v1", "type": "text-generation", ... },
    { "id": "text-classify-v1", "name": "Text Classification v1", "type": "text-classification", ... },
    { "id": "summarizer-v1", "name": "Summarizer v1", "type": "summarization", ... }
  ]
}
```

---

### Generic Inference

```
POST /api/inference
Content-Type: application/json
```

Body:
```json
{ "modelId": "text-gen-v1", "input": { "prompt": "Explain machine learning." } }
```

Response:
```json
{ "status": "ok", "result": { "model": "text-gen-v1", "generatedText": "...", "tokensUsed": 42 } }
```

---

### Text Generation

```
POST /api/text/generate
Content-Type: application/json
```

Body:
```json
{ "prompt": "Tell me about AI.", "options": { "maxTokens": 200 } }
```

---

### Text Classification

```
POST /api/text/classify
Content-Type: application/json
```

Body:
```json
{ "text": "This product is amazing!" }
```

Response:
```json
{
  "status": "ok",
  "result": {
    "model": "text-classify-v1",
    "label": "positive",
    "confidence": 0.7312,
    "scores": [...]
  }
}
```

---

### Text Summarization

```
POST /api/text/summarize
Content-Type: application/json
```

Body:
```json
{ "text": "Long article text...", "options": { "maxLength": 120 } }
```

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## License

MIT © UMAR ABUBAKAR
