generator = None

def _load_generator():
    global generator
    if generator is not None:
        return
    try:
        from transformers import pipeline
        # Try recommended seq2seq task first, fall back if unsupported
        try:
            generator = pipeline("text2text-generation", model="google/flan-t5-base")
        except Exception:
            generator = pipeline("text-generation", model="gpt2")
    except Exception:
        generator = None


def generate_answer(question, chunks):
    """
    Given a question and retrieved text chunks, generates an answer using local flan-t5-base.
    """
    if not chunks:
        return "I could not find this in the text."
        
    context = "\n".join(chunks)
    
    prompt = f"""Answer the question using ONLY the context provided below.
If the answer is not in the context, say "I could not find this in the text."

Context:
{context}

Question: {question}
Answer:"""

    # Ensure generator is loaded; if not available, return a safe fallback
    _load_generator()
    if generator is None:
        # Simple fallback: return a concise extract from context
        return context[:1000] + ("..." if len(context) > 1000 else "")

    try:
        result = generator(prompt, max_length=512, num_return_sequences=1)
        
        # Extract the generated text
        if isinstance(result, list) and isinstance(result[0], dict):
            answer = result[0].get('generated_text') or result[0].get('text') or str(result[0])
        else:
            answer = str(result)
            
        # If the model echoes the prompt (e.g., text-generation pipeline), strip it out
        if answer.startswith(prompt):
            answer = answer[len(prompt):].strip()
            
        return answer
    except Exception as e:
        print(f"Generation error: {e}")
        return "Sorry, I encountered an error while generating the answer."
