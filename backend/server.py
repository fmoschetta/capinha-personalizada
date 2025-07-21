from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import uuid
from datetime import datetime

app = FastAPI(title="Capinha Personalizada API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploaded images
os.makedirs("/app/backend/static/uploads", exist_ok=True)
os.makedirs("/app/backend/static/gallery", exist_ok=True)
app.mount("/static", StaticFiles(directory="/app/backend/static"), name="static")

# Data Models
class PhoneModel(BaseModel):
    id: str
    name: str
    brand: str
    image_url: str
    dimensions: dict
    popular: bool = False

class GalleryItem(BaseModel):
    id: str
    title: str
    category: str
    image_url: str
    thumbnail_url: str
    trending: bool = False
    customizable: bool = True

class CustomDesign(BaseModel):
    id: str
    phone_model: str
    design_type: str  # "upload" or "gallery"
    image_url: str
    position: dict  # x, y, scale, rotation
    text_overlay: Optional[dict] = None
    created_at: str

class Order(BaseModel):
    id: str
    design_id: str
    customer_info: dict
    status: str = "pending"
    created_at: str

# Mock database - In production, use MongoDB
phone_models = [
    {
        "id": "iphone15-pro",
        "name": "iPhone 15 Pro",
        "brand": "Apple",
        "image_url": "/static/models/iphone15-pro.png",
        "dimensions": {"width": 76.7, "height": 159.9, "thickness": 8.25},
        "popular": True
    },
    {
        "id": "iphone15",
        "name": "iPhone 15",
        "brand": "Apple",
        "image_url": "/static/models/iphone15.png",
        "dimensions": {"width": 77.8, "height": 157.8, "thickness": 7.8},
        "popular": True
    },
    {
        "id": "samsung-s24",
        "name": "Galaxy S24",
        "brand": "Samsung",
        "image_url": "/static/models/galaxy-s24.png",
        "dimensions": {"width": 79.0, "height": 167.0, "thickness": 7.9},
        "popular": True
    },
    {
        "id": "iphone14",
        "name": "iPhone 14",
        "brand": "Apple",
        "image_url": "/static/models/iphone14.png",
        "dimensions": {"width": 71.5, "height": 146.7, "thickness": 7.8},
        "popular": False
    }
]

gallery_items = [
    {
        "id": "hearts-floating",
        "title": "Corações Flutuantes",
        "category": "romantic",
        "image_url": "/static/gallery/hearts-floating.png",
        "thumbnail_url": "/static/gallery/thumbs/hearts-floating.jpg",
        "trending": True,
        "customizable": True
    },
    {
        "id": "manuscript-name",
        "title": "Nome Manuscrito",
        "category": "text",
        "image_url": "/static/gallery/manuscript-name.png",
        "thumbnail_url": "/static/gallery/thumbs/manuscript-name.jpg",
        "trending": True,
        "customizable": True
    },
    {
        "id": "delicate-flowers",
        "title": "Flores Delicadas",
        "category": "nature",
        "image_url": "/static/gallery/delicate-flowers.png",
        "thumbnail_url": "/static/gallery/thumbs/delicate-flowers.jpg",
        "trending": False,
        "customizable": True
    },
    {
        "id": "geometric-modern",
        "title": "Padrões Geométricos",
        "category": "modern",
        "image_url": "/static/gallery/geometric-modern.png",
        "thumbnail_url": "/static/gallery/thumbs/geometric-modern.jpg",
        "trending": True,
        "customizable": True
    },
    {
        "id": "motivational-quote",
        "title": "Frase Motivacional",
        "category": "text",
        "image_url": "/static/gallery/motivational-quote.png",
        "thumbnail_url": "/static/gallery/thumbs/motivational-quote.jpg",
        "trending": False,
        "customizable": True
    },
    {
        "id": "minimal-elegant",
        "title": "Minimalista Elegante",
        "category": "minimal",
        "image_url": "/static/gallery/minimal-elegant.png",
        "thumbnail_url": "/static/gallery/thumbs/minimal-elegant.jpg",
        "trending": True,
        "customizable": True
    }
]

# In-memory storage (use database in production)
designs = {}
orders = {}

@app.get("/")
def read_root():
    return {"message": "Capinha Personalizada API - Ativo!", "version": "1.0.0"}

@app.get("/api/phone-models")
def get_phone_models():
    """Retorna todos os modelos de celular disponíveis"""
    return {"models": phone_models}

@app.get("/api/phone-models/popular")
def get_popular_phone_models():
    """Retorna apenas os modelos populares"""
    popular = [model for model in phone_models if model.get("popular", False)]
    return {"models": popular}

@app.get("/api/gallery")
def get_gallery():
    """Retorna todas as artes da galeria"""
    return {"items": gallery_items}

@app.get("/api/gallery/category/{category}")
def get_gallery_by_category(category: str):
    """Retorna artes filtradas por categoria"""
    filtered = [item for item in gallery_items if item["category"] == category]
    return {"items": filtered, "category": category}

@app.get("/api/gallery/trending")
def get_trending_gallery():
    """Retorna artes em destaque/trending"""
    trending = [item for item in gallery_items if item.get("trending", False)]
    return {"items": trending}

@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload de imagem personalizada"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"/app/backend/static/uploads/{unique_filename}"
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    image_url = f"/static/uploads/{unique_filename}"
    
    return {
        "success": True,
        "image_url": image_url,
        "filename": unique_filename
    }

@app.post("/api/create-design")
def create_design(design_data: dict):
    """Cria um novo design personalizado"""
    design_id = str(uuid.uuid4())
    design = {
        "id": design_id,
        "phone_model": design_data.get("phone_model"),
        "design_type": design_data.get("design_type"),
        "image_url": design_data.get("image_url"),
        "position": design_data.get("position", {"x": 0, "y": 0, "scale": 1, "rotation": 0}),
        "text_overlay": design_data.get("text_overlay"),
        "created_at": datetime.now().isoformat()
    }
    
    designs[design_id] = design
    return {"success": True, "design": design}

@app.get("/api/design/{design_id}")
def get_design(design_id: str):
    """Recupera um design específico"""
    if design_id not in designs:
        raise HTTPException(status_code=404, detail="Design não encontrado")
    
    return {"design": designs[design_id]}

@app.post("/api/create-order")
def create_order(order_data: dict):
    """Cria um novo pedido"""
    order_id = str(uuid.uuid4())
    order = {
        "id": order_id,
        "design_id": order_data.get("design_id"),
        "customer_info": order_data.get("customer_info"),
        "status": "pending",
        "created_at": datetime.now().isoformat()
    }
    
    orders[order_id] = order
    return {"success": True, "order": order}

@app.get("/api/stats")
def get_stats():
    """Estatísticas da plataforma"""
    return {
        "total_designs": len(designs),
        "total_orders": len(orders),
        "popular_models": len([m for m in phone_models if m.get("popular")]),
        "gallery_items": len(gallery_items)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)