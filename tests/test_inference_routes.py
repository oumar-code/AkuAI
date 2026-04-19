"""API tests for inference and model routes."""

from __future__ import annotations

from httpx import AsyncClient


async def test_list_models_returns_catalogue(client: AsyncClient) -> None:
    response = await client.get("/api/v1/models")

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == len(data["models"])
    assert data["models"][0]["id"] == "gemma-2b"


async def test_gemma_infer_returns_hub_response(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/models/gemma/infer",
        json={"prompt": "hello", "hub_id": "edge-1", "max_tokens": 8, "temperature": 0.3},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["hub_id"] == "edge-1"
    assert data["model"] == "gemma-2b"
    assert data["tokens_used"] == 8


async def test_text_and_embedding_endpoints(client: AsyncClient) -> None:
    generate = await client.post(
        "/api/v1/text/generate",
        json={"prompt": "Tell me something short", "max_tokens": 20},
    )
    classify = await client.post(
        "/api/v1/text/classify",
        json={"text": "AkuAI helps with text tasks.", "labels": ["ai", "sports"]},
    )
    summarize = await client.post(
        "/api/v1/text/summarize",
        json={"text": "x" * 120, "min_length": 20, "max_length": 60},
    )
    embeddings = await client.post("/api/v1/embeddings", json={"input": ["hello world", "aku ai"]})

    assert generate.status_code == 200
    assert classify.status_code == 200
    assert summarize.status_code == 200
    assert embeddings.status_code == 200

    assert generate.json()["finish_reason"] == "length"
    assert classify.json()["top_label"] == "ai"
    assert summarize.json()["original_length"] == 120
    assert embeddings.json()["dimensions"] == 384


async def test_generic_inference_endpoint(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/inference",
        json={"model": "gemma-2b", "prompt": "infer this", "provider": "local"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["model"] == "gemma-2b"
    assert data["provider"] == "local"
    assert "Inference response" in data["output"]
