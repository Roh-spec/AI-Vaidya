import fitz  # PyMuPDF
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from ollama_embeddings import OllamaEmbeddings
from settings import VECTORSTORE_DIR

def process_and_store_pdf(file_path: str):
    """
    Extracts text from a PDF, chunks it, and stores it in ChromaDB.
    Uses larger chunks with more overlap so the model gets richer context.
    """
    print(f"Loading PDF: {file_path}")
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    
    doc.close()
        
    print("Splitting into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    
    print(f"Embedding {len(chunks)} chunks using Ollama...")
    embeddings = OllamaEmbeddings()
    
    vectorstore = Chroma.from_texts(
        texts=chunks, 
        embedding=embeddings, 
        persist_directory=str(VECTORSTORE_DIR),
        collection_name="ayurveda_docs"
    )
    
    print(f"Done. {len(chunks)} chunks stored in {VECTORSTORE_DIR}")
    return len(chunks)

def clear_database():
    import shutil
    if VECTORSTORE_DIR.exists():
        shutil.rmtree(VECTORSTORE_DIR)
        return True
    return False

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        process_and_store_pdf(sys.argv[1])
