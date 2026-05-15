import fitz  # PyMuPDF
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
import chromadb

def process_and_store_pdf(file_path: str):
    """
    Extracts text from a PDF, chunks it, and stores it in ChromaDB.
    """
    print(f"Loading PDF: {file_path}")
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
        
    print("Splitting into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    
    print("Embedding and storing in ChromaDB...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Initialize ChromaDB client
    client = chromadb.PersistentClient(path="./vectorstore")
    collection = client.get_or_create_collection(name="ayurveda_docs")
    
    # Generate IDs and add to collection
    ids = [f"chunk_{i}" for i in range(len(chunks))]
    
    # Chroma handles the embedding if we pass the embedding function,
    # but we can also just embed manually or use LangChain's Chroma wrapper.
    # We will use Chroma directly with its built-in embedding function if possible,
    # or just use LangChain's Chroma. Let's use LangChain's Chroma for simplicity:
    from langchain_community.vectorstores import Chroma
    vectorstore = Chroma.from_texts(
        texts=chunks, 
        embedding=embeddings, 
        persist_directory="./vectorstore",
        collection_name="ayurveda_docs"
    )
    vectorstore.persist()
    
    print("Done. Vectorstore saved to ./vectorstore")
    return len(chunks)

def clear_database():
    import shutil
    import os
    if os.path.exists("./vectorstore"):
        shutil.rmtree("./vectorstore")
        return True
    return False

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        process_and_store_pdf(sys.argv[1])
