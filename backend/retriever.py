from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from settings import VECTORSTORE_DIR, NVIDIA_API_KEY, NVIDIA_BASE_URL, NVIDIA_EMBEDDING_MODEL

embeddings = None


def _get_embeddings():
    global embeddings
    if embeddings is None:
        embeddings = OpenAIEmbeddings(
            api_key=NVIDIA_API_KEY,
            base_url=NVIDIA_BASE_URL,
            model=NVIDIA_EMBEDDING_MODEL,
            check_embedding_ctx_length=False
        )
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
    return [
        doc.page_content
        for doc in docs
        if getattr(doc, "page_content", None) and doc.page_content.strip()
    ]
