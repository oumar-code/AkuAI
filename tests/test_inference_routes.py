"""API smoke tests for inference and model routes."""

from __future__ import annotations

from httpx import AsyncClient


async def test_list_models_returns_catalogue(client: AsyncClient) -> None:
    response = await client.get("/api/v1/models")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert len(data["models"]) == data["total"]


async def test_run_inference_returns_stub_response(client: AsyncClient) -> None:
    payload = {"model": "gemma-2b", "prompt": "hello world"}
    response = await client.post("/api/v1/inference", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["model"] == "gemma-2b"
    assert "[STUB] Inference response" in data["output"]


async def test_text_generation_route_returns_text(client: AsyncClient) -> None:
    payload = {"prompt": "write a short sentence", "model": "gemma-2b"}
    response = await client.post("/api/v1/text/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["model"] == "gemma-2b"
    assert "[STUB] Generated text" in data["text"]


async def test_gemma_relay_returns_hub_id(client: AsyncClient) -> None:
    payload = {"prompt": "hello from edge", "hub_id": "hub-1"}
    response = await client.post("/api/v1/models/gemma/infer", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["hub_id"] == "hub-1"
    assert data["model"] == "gemma-2b"


async def test_classification_route_returns_top_label(client: AsyncClient) -> None:
    payload = {"text": "I love this product", "labels": ["positive", "negative"]}
    response = await client.post("/api/v1/text/classify", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["top_label"] == "positive"
    assert len(data["scores"]) == 2


async def test_summarization_route_returns_summary(client: AsyncClient) -> None:
    payload = {
        "text": "AkuAI " * 20,
        "model": "facebook/bart-large-cnn",
        "min_length": 40,
        "max_length": 150,
    }
    response = await client.post("/api/v1/text/summarize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["model"] == "facebook/bart-large-cnn"
    assert "[STUB] Summary" in data["summary"]


async def test_embeddings_route_returns_vectors(client: AsyncClient) -> None:
    payload = {"input": ["hello", "world"]}
    response = await client.post("/api/v1/embeddings", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["dimensions"] == 384
    assert len(data["embeddings"]) == 2
