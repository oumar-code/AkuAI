"""Tests for AkuAI inference, text, embeddings, and model endpoints."""

from __future__ import annotations

from httpx import AsyncClient


async def test_run_inference(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/inference",
        json={"model": "gemma-2b", "prompt": "Hello, world!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["model"] == "gemma-2b"
    assert "output" in data
    assert "request_id" in data


async def test_generate_text(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/text/generate",
        json={"prompt": "Tell me a story", "model": "gemma-2b"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert data["model"] == "gemma-2b"
    assert "request_id" in data


async def test_classify_text(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/text/classify",
        json={
            "text": "The movie was absolutely wonderful!",
            "labels": ["positive", "negative"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "scores" in data
    assert "top_label" in data
    assert data["top_label"] in ["positive", "negative"]


async def test_summarize_text(client: AsyncClient) -> None:
    long_text = "A" * 200
    response = await client.post(
        "/api/v1/text/summarize",
        json={"text": long_text, "model": "facebook/bart-large-cnn"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert data["original_length"] == len(long_text)


async def test_get_embeddings_single(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/embeddings",
        json={"input": "embed this text"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "embeddings" in data
    assert len(data["embeddings"]) == 1
    assert data["dimensions"] == 384


async def test_get_embeddings_list(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/embeddings",
        json={"input": ["first text", "second text"]},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["embeddings"]) == 2


async def test_list_models(client: AsyncClient) -> None:
    response = await client.get("/api/v1/models")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert data["total"] == len(data["models"])
    assert data["total"] > 0


async def test_gemma_infer(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/models/gemma/infer",
        json={"prompt": "What is 2+2?", "hub_id": "edge-hub-001"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert data["hub_id"] == "edge-hub-001"
    assert data["model"] == "gemma-2b"
