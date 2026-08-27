from sentence_transformers import SentenceTransformer
import numpy as np

# Singleton pattern for the model
_model = None

def load_embedding_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

def generate_embedding(text: str) -> np.ndarray:
    model = load_embedding_model()
    # Ensure it's a 2D array if model.encode returns 1D
    embedding = model.encode(text)
    return np.array(embedding, dtype=np.float32)

def chunk_text(text: str, chunk_size=200, overlap=50) -> list:
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks
