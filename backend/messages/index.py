import os

from llama_index.llms.google_genai import GoogleGenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.postgres import PGVectorStore
from llama_index.core import VectorStoreIndex

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "uh oh")

llm = GoogleGenAI(
    model="gemini-2.5-flash",
    api_key=GEMINI_API_KEY,
)

embedding_model = OpenAIEmbedding(model="text-embedding-3-large")

vector_store = PGVectorStore.from_params(
    database="db",
    host="localhost",
    user="postgres",
    password="postgres",
    port=5432,
    table_name="embedded_user_messages",
    embed_dim=768,
)

index = VectorStoreIndex.from_vector_store(vector_store)
