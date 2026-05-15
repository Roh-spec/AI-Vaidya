from langchain_community.vectorstores import Chroma
from ollama_embeddings import OllamaEmbeddings
from settings import VECTORSTORE_DIR

embeddings = None


def _get_embeddings():
    global embeddings
    if embeddings is None:
        embeddings = OllamaEmbeddings()
    return embeddings

def retrieve_chunks(question, top_k=6):
    """
    Given a question, returns the top_k most relevant chunks from ChromaDB.
    Uses top_k=6 to give the model more context to work with.
    """
    if not VECTORSTORE_DIR.exists():
        return []

    vectorstore = Chroma(
        persist_directory=str(VECTORSTORE_DIR),
        embedding_function=_get_embeddings(),
        collection_name="ayurveda_docs"
    )
    
    # Retrieve top K chunks
    docs = vectorstore.similarity_search(question, k=top_k)
    return [doc.page_content for doc in docs]
