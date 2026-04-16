"""Tests to exercise support modules used by the API runtime."""

from __future__ import annotations

from app.db.session import AsyncSessionLocal
from app.routers.health import health_check


async def test_health_check_function() -> None:
    payload = await health_check()
    assert payload["status"] == "ok"
    assert payload["service"] == "akuai"


async def test_async_session_factory_exists() -> None:
    assert AsyncSessionLocal is not None
    session = AsyncSessionLocal()
    assert session is not None
    assert session.bind is not None
    await session.close()
