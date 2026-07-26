"""
AgroHub AI Microservice — FastAPI entry point.

Serves crop price predictions from pre-trained SARIMA/GARCH models.
Run with: uvicorn main:app --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from predict import generate_forecast, CROP_META

app = FastAPI(title="AgroHub AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok", "service": "agrohub-ai"}


@app.get("/crops")
def list_crops():
    return [
        {"id": cid, "name": meta["name"], "origin": meta["origin"], "category": meta["category"]}
        for cid, meta in CROP_META.items()
    ]


@app.get("/predictions/{crop_id}")
def get_prediction(crop_id: str):
    result = generate_forecast(crop_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"No trained model found for crop '{crop_id}'")
    return result
