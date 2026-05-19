from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from settings import NVIDIA_API_KEY, NVIDIA_BASE_URL, NVIDIA_LLM_MODEL


def generate_answer(question, chunks):
    """
    Given a question and retrieved text chunks, generate an answer
    using the NVIDIA NIM API (Llama 3.1 70B) via LangChain's ChatOpenAI interface.
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

QUESTION: {question}"""

    try:
        # We use ChatOpenAI pointing to the NVIDIA base URL
        chat = ChatOpenAI(
            api_key=NVIDIA_API_KEY,
            base_url=NVIDIA_BASE_URL,
            model=NVIDIA_LLM_MODEL,
            temperature=0.4,
            max_tokens=512,
        )
        
        messages = [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content=prompt)
        ]
        
        response = chat.invoke(messages)
        answer = response.content.strip()
        return answer if answer else "I could not generate an answer."
    except Exception as e:
        print(f"Generation error: {e}")
        return "Sorry, I encountered an error while generating the answer. Make sure your NVIDIA_API_KEY is correct."
