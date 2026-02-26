import os
from typing import List
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_postgres import PGVector
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

class RAGEngine:
    def __init__(self):
        # The Gemini API key is optional for development; if it's not present we
        # create a dummy embeddings object that won't actually call the API.  The
        # LangChain class will raise a ValidationError if the key is None, which
        # previously caused import-time crashes when the environment wasn't
        # configured.  This guard keeps the package importable and allows the
        # rest of the system to operate (RAG queries simply return empty results).
        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key:
            # create a no-op stand-in that matches the interface we need
            class _DummyEmbeddings:
                def embed_documents(self, texts):
                    return [[0.0]] * len(texts)
                def embed_query(self, text):
                    return [0.0]

            self.embeddings = _DummyEmbeddings()
            print("⚠️  GEMINI_API_KEY not found; RAG functionality will be disabled.")
        else:
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/gemini-embedding-001",
                google_api_key=gemini_key
            )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        # Cloud-native PGVector on Neon
        self.connection_string = os.getenv("DATABASE_URL")
        self.collection_name = "hackathon_embeddings"
        
        # Initialize vector store only if we have a usable embeddings instance
        if hasattr(self.embeddings, "embed_documents"):
            try:
                self.vector_store = PGVector(
                    embeddings=self.embeddings,
                    collection_name=self.collection_name,
                    connection=self.connection_string,
                    use_jsonb=True,
                )
            except Exception as e:
                # If PGVector initialization fails (e.g. missing DB), disable
                # RAG and keep going.
                print(f"⚠️  Could not initialize PGVector store: {e}")
                self.vector_store = None
        else:
            self.vector_store = None

    def add_documents(self, documents: List[str]):
        """Bulk adds raw text documents to the vector store."""
        all_docs = []
        for doc_text in documents:
            chunks = self.text_splitter.split_text(doc_text)
            all_docs.extend([Document(page_content=chunk) for chunk in chunks])
        if not self.vector_store:
            # no-op when RAG is disabled
            return
        self.vector_store.add_documents(all_docs)
        if hasattr(self.vector_store, 'persist'):
            self.vector_store.persist()

    def query(self, query: str, k: int = 3) -> List[Document]:
        """Performs a similarity search in the vector store."""
        if not self.vector_store:
            return []
        return self.vector_store.similarity_search(query, k=k)

# Global engine instance
rag_engine = RAGEngine()
