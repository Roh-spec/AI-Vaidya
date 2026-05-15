import requests
from settings import OLLAMA_BASE_URL, OLLAMA_MODEL


def generate_answer(question, chunks):
    """
    Given a question and retrieved text chunks, generate an answer
    using the local Ollama model via its REST API.
    """
    if not chunks:
        return "I could not find this in the text."

    context = "\n---\n".join(chunks)

    prompt = f"""You are AI Vaidya, a helpful document Q&A assistant.

Your task: Read the DOCUMENT EXCERPTS below and answer the user's QUESTION based on what you find.
- Base your answer on the document excerpts provided.
- If the excerpts contain relevant information, summarize and explain it clearly.
- If the excerpts truly contain no relevant information at all, say "I could not find this in the provided document."

DOCUMENT EXCERPTS:
{context}

QUESTION: {question}

ANSWER:"""

    try:
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.4,
                    "num_predict": 512,
                },
            },
            timeout=120,
        )
        response.raise_for_status()
        data = response.json()
        answer = data.get("response", "").strip()
        return answer if answer else "I could not generate an answer."
    except requests.ConnectionError:
        return (
            "Could not connect to Ollama. "
            "Make sure Ollama is running (ollama serve)."
        )
    except requests.Timeout:
        return "The model took too long to respond. Please try again."
    except Exception as e:
        print(f"Generation error: {e}")
        return "Sorry, I encountered an error while generating the answer."
