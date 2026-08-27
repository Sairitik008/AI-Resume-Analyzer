import faiss
import numpy as np

class VectorStore:
    def __init__(self):
        self.index = None
        self.chunks = []

    def build_index(self, chunks: list, embeddings: np.ndarray):
        """
        Builds an in-memory FAISS index.
        Note: Persistent storage can be added later if needed.
        """
        if len(embeddings) == 0:
            return
            
        dim = embeddings.shape[1] if len(embeddings.shape) > 1 else embeddings.shape[0]
        self.index = faiss.IndexFlatL2(dim)
        
        # Ensure 2D array
        if len(embeddings.shape) == 1:
            embeddings = embeddings.reshape(1, -1)
            
        self.index.add(embeddings)
        self.chunks = chunks

    def search(self, query_embedding: np.ndarray, top_k=3) -> list:
        if not self.index or len(self.chunks) == 0:
            return []
            
        if len(query_embedding.shape) == 1:
            query_embedding = query_embedding.reshape(1, -1)
            
        k = min(top_k, len(self.chunks))
        distances, indices = self.index.search(query_embedding, k)
        
        results = []
        for idx in indices[0]:
            if 0 <= idx < len(self.chunks):
                results.append(self.chunks[idx])
        return results
