from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
import os

def retrieve_chunks(question, top_k=3):
    """
    Given a question, returns the top_k most relevant chunks from ChromaDB.
    """
    if not os.path.exists("./vectorstore"):
        return []
        
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = Chroma(
        persist_directory="./vectorstore",
        embedding_function=embeddings,
        collection_name="ayurveda_docs"
    )
    
    # Retrieve top K chunks
    docs = vectorstore.similarity_search(question, k=top_k)
    return [doc.page_content for doc in docs]
