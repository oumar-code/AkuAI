"""Tests for the AkuAI inference service stubs."""

from __future__ import annotations

from app.schemas.inference import (
    EmbeddingsRequest,
    GemmaInferRequest,
    InferenceRequest,
    ModelProvider,
    TextClassifyRequest,
    TextGenerateRequest,
    TextSummarizeRequest,
)
from app.services.inference import InferenceService


async def test_inference_service_stub_methods() -> None:
    service = InferenceService()

    inference = await service.run_inference(
        InferenceRequest(
            model="gemma-2b",
            prompt="hello world",
            provider=ModelProvider.LOCAL,
        )
    )
    assert inference.model == "gemma-2b"
    assert inference.provider == ModelProvider.LOCAL
    assert inference.tokens_used == 2

    generated = await service.generate_text(
        TextGenerateRequest(prompt="generate this", model="gemma-2b", max_tokens=32)
    )
    assert generated.model == "gemma-2b"
    assert generated.tokens_used == 32

    classified = await service.classify_text(
        TextClassifyRequest(text="great product", labels=["positive", "negative"])
    )
    assert classified.top_label == "positive"
    assert len(classified.scores) == 2

    summarized = await service.summarize_text(
        TextSummarizeRequest(
            text="a" * 60,
            max_length=120,
            min_length=20,
        )
    )
    assert summarized.original_length == 60
    assert summarized.summary_length > 0

    embeddings = await service.get_embeddings(
        EmbeddingsRequest(input=["hello", "world"], model="sentence-transformers/all-MiniLM-L6-v2")
    )
    assert embeddings.dimensions == 384
    assert len(embeddings.embeddings) == 2

    models = await service.list_models()
    assert models.total == len(models.models)
    assert models.total > 0

    gemma = await service.gemma_infer(
        GemmaInferRequest(prompt="edge prompt", hub_id="hub-1", max_tokens=16)
    )
    assert gemma.hub_id == "hub-1"
    assert gemma.tokens_used == 16
