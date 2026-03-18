# Aku AI

## Overview
Aku AI is a microservice in the Aku platform ecosystem. It provides AI-powered features, inference, and automation for users and other services.

## Features
- REST API for AI/ML tasks
- Scalable Node.js backend

## Getting Started

### Prerequisites
- Node.js 20+
- Docker (optional)

### Development
```bash
git clone <repo-url>
cd AkuAI
npm install
npm run dev
```

### Docker
```bash
docker build -t aku-ai:latest .
docker run -p 8080:8080 aku-ai:latest
```

### Testing
```bash
npm test
```

## Deployment
See `.github/workflows/ci.yml` for CI/CD pipeline.

## License
MIT
