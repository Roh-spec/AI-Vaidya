import fitz  # PyMuPDF
import shutil
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from settings import VECTORSTORE_DIR, NVIDIA_API_KEY, NVIDIA_BASE_URL, NVIDIA_EMBEDDING_MODEL

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

    text = text.strip()
    if not text:
        raise ValueError("The PDF does not contain readable text.")
        
    print("Splitting into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = [
        chunk.strip()
        for chunk in text_splitter.split_text(text)
        if chunk and chunk.strip()
    ]

    if not chunks:
        raise ValueError("No valid text chunks could be created from the PDF.")
    
    print(f"Embedding {len(chunks)} chunks using NVIDIA NIM API...")
    embeddings = OpenAIEmbeddings(
        api_key=NVIDIA_API_KEY,
        base_url=NVIDIA_BASE_URL,
        model=NVIDIA_EMBEDDING_MODEL,
        check_embedding_ctx_length=False
    )

    if VECTORSTORE_DIR.exists():
        shutil.rmtree(VECTORSTORE_DIR)
    
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
