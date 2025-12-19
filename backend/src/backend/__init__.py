from fastapi import FastAPI
import google.genai as genai
from pinecone import Pinecone, ServerlessSpec
from agents import Agent , Runner , RunConfig , AsyncOpenAI , OpenAIChatCompletionsModel  , function_tool  , input_guardrail , RunContextWrapper , TResponseInputItem , GuardrailFunctionOutput , InputGuardrailTripwireTriggered  , model_settings ,ModelSettings
from dotenv import load_dotenv
import os
from uuid import uuid4
from pydantic import BaseModel
import asyncio


load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
API_KEY_2 = os.getenv("OPENAI_API_KEY")
pinecone_api = os.getenv("PINECONE_API_KEY")


if not (API_KEY and API_KEY_2):
    print("API KEY IS NOT FOUND")



app = FastAPI()


#? Configure Google Gen AI
# Check if genai has configure method, otherwise proceed without explicit configuration
# if hasattr(genai, 'configure'):
#     genai.configure(api_key=API_KEY)


Genai_client = genai.Client(api_key=API_KEY)


#? This is the pinecone class it connects our script to pinecone using your API key.
pc = Pinecone(api_key=pinecone_api)


#? You are giving a name to your index: "userdata".
#? Think of an index like a folder or a database where you store your vector data (embeddings).
index="bookcontentembeddings"
# index = "userdata"


#? pc.list_indexes() → gets all existing index objects from your Pinecone account.
#? .names() → gives you a list of just the names (e.g., ['userdata', 'documents', 'images']).
#? if index not in ... → checks if your index name does NOT already exist.
#? If "userdata" does not exist → you should create it.

if not index in pc.list_indexes().names():
    pc.create_index(name=index , spec=ServerlessSpec(cloud='aws' , region='us-east-1') , dimension=768)
else:
    print("name already Exsits")



#? This line connects to the "BookContentEmbeddings" index so we can save and search data in it.
myIndex = pc.Index(index)



#? ---------------------------------------------------------
#? 1. Book content into chunks
#? ---------------------------------------------------------

def text_into_chunks(text, maxlen=30):
    """
    Splits the text into chunks of `maxlen` words.
    """
    chunks = []
    words_list = text.split()
    for i in range(0, len(words_list), maxlen): 
        # Loop from 0 to length of words_list, incrementing by maxlen in each iteration
        chunk = " ".join(words_list[i:i+maxlen])
        chunks.append(chunk) 
    return chunks



#? ---------------------------------------------------------
#? 2. Upload Book content to Pinecone
#? ---------------------------------------------------------

def upload_book_to_pinecone(client, pinecone_index, file_name="book-content.md"):
    """
    Reads the book content, chunks it, embeds it using Gemini,
    and uploads vectors to Pinecone.
    """
    print("--- Starting Book Upload Process ---")

    # 1. Construct File Path
    # Go up 4 levels (adjust as needed for your folder structure)
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    content_path = os.path.join(base_dir, file_name)

    # 2. Load Content
    if not os.path.exists(content_path):
        print(f"❌ Error: Content file not found at {content_path}")
        return

    with open(content_path, "r", encoding="utf-8") as f:
        content = f.read()

    chunks_list = text_into_chunks(content)
    print(f"✅ Loaded {len(chunks_list)} chunks from file.")

    # 3. Embed and Upsert
    batch_limit = 100
    vectors_to_upsert = []

    try:
        print("Starting embedding and upload...")
        for i, chunk in enumerate(chunks_list):

            # --- Gemini API Call ---
            try:
                if Genai_client and hasattr(Genai_client, 'models'):
                    # Use the client if available
                    response = Genai_client.models.embed_content(
                        contents=chunk,
                        model="text-embedding-004"
                    )
                else:
                    # Fallback to direct genai module usage
                    response = genai.embed_content(
                        model="text-embedding-004",
                        content=chunk
                    )
            except Exception as embed_error:
                print(f"❌ Embedding error for chunk {i}: {embed_error}")
                continue  # Skip this chunk and continue with others

            # Extract embedding values
            if hasattr(response, 'embeddings') and len(response.embeddings) > 0:
                embedding_vector = response.embeddings[0].values
            else:
                # Handle case where response format is different
                embedding_vector = response.embedding if hasattr(response, 'embedding') else response

            vector_id = str(uuid4())

            # Prepare record for Pinecone
            vectors_to_upsert.append((vector_id, embedding_vector, {'text': chunk}))

            # --- Batch Upsert ---
            if len(vectors_to_upsert) >= batch_limit:
                pinecone_index.upsert(vectors_to_upsert)
                vectors_to_upsert = [] # Reset batch
                print(f"Batch saved. Progress: {i+1}/{len(chunks_list)}")

        # --- Final Batch ---
        if vectors_to_upsert:
            pinecone_index.upsert(vectors_to_upsert)
            print("Final batch saved.")

        print("🎉 Success: All data saved in Pinecone.")

    except Exception as e:
        print(f"❌ Error during upload: {e}")


# upload_book_to_pinecone(Genai_client , myIndex)



#! Start from here

# external_client = AsyncOpenAI(
#     base_url="https://generativelanguage.googleapis.com/v1beta/",
#     api_key=API_KEY,
# )

# model = OpenAIChatCompletionsModel(
#     model="gemini-2.5-flash",
#     openai_client=external_client,
# )

# run_config = RunConfig(
#     model="gpt-4o-mini",
#     # model_provider = external_client,
# )


#? ---------------------------------------------------------
#? 3. Querying Pinecone
#? ---------------------------------------------------------
#? function to retrieve data from pinecone

@function_tool
async def query_pinecone(query_text: str, top_k: int = 5):
    """
    Converts user query to a Gemini vector and searches Pinecone.
    """
    try:
        print(f"🔍 PINECONE SEARCH: '{query_text}'")
        # 1. Convert User Query to Vector using Gemini
        response = Genai_client.models.embed_content(
            model="text-embedding-004",
            contents=query_text
        )

        # 2. Extract the vector (list of 768 floats)
        query_vector = response.embeddings[0].values

        # 3. Search Pinecone
        query_result = myIndex.query(
            vector=query_vector,   # Send the Gemini vector
            top_k=top_k,           # Get top matches
            include_metadata=True  # Get the original text back
        )

        # 4. Extract text from matches
        matches = query_result['matches']
        retrieved_chunks = [match['metadata']['text'] for match in matches]
        print(f"✅ PINECONE FOUND: {len(retrieved_chunks)} chunks")

        return retrieved_chunks

    except Exception as e:
        print(f"❌ Pinecone query failed: {e}")
        return []



#* Input - Quardrial - Agent

class InputClassification(BaseModel):
    is_off_topic : bool
    reason : str


input_guardrail_agent = Agent(
    name="Input Guardrail Agent",
    instructions="""
    Role: VERY PERMISSIVE content filter. Your job is ONLY to block OBVIOUS spam.
    
    **DEFAULT: ALLOW EVERYTHING (is_off_topic=False)**
    - When in doubt, ALLOW IT.
    - If it could POSSIBLY relate to tech/science/engineering, ALLOW IT.
    
    **BLOCK ONLY THESE (is_off_topic=True):**
    - Cooking/recipes
    - Weather questions
    - Jokes/riddles/poems
    - Politics/elections
    - Celebrities/entertainment
    - "Write me an essay/story/email"
    - Personal advice (relationships, health)
    
    **ALWAYS ALLOW (is_off_topic=False):**
    - ANY technical term or acronym (VLA, LLM, SLAM, IMU, etc.)
    - ANY question with words: AI, robot, physics, sensor, motor, control, algorithm, neural, machine
    - "What is [anything]?" - ALLOW (let Pinecone decide)
    - "Explain [anything]?" - ALLOW (let Pinecone decide)
    - Greetings (Hi, Hello, Who are you)
    
    **RULE: If uncertain, set is_off_topic=False**
    """,
    output_type=InputClassification,
    model="gpt-4.1-nano",
    model_settings=ModelSettings(max_tokens=60)
) 


@input_guardrail
async def input_guardrail_function(context:RunContextWrapper[None] ,  agent : Agent , input: str | list[TResponseInputItem]) ->  GuardrailFunctionOutput:
   result = await Runner.run(starting_agent=input_guardrail_agent , input=input)
   print("result of input_quardrail_Agent" , result.final_output)

   return GuardrailFunctionOutput(
       tripwire_triggered=result.final_output.is_off_topic,
       output_info=result.final_output.reason
   )



#* Main Agent
agent = Agent(
    name="Consumer Agent",
    instructions=""""
    You are ARIA, the AI assistant for the 'Physical AI & Humanoid Robotics' book.
    
    ## Your Task:
    1. **Greetings:** If user says "Hi", "Hello", "Who are you?" → Answer warmly, introduce yourself as ARIA.
    
    2. **ALL Questions:** For ANY question, use the `query_pinecone` tool to search the book.
    
    3. **If Pinecone returns results:** Answer using ONLY that information.
    
    4. **If Pinecone returns NO results or empty:**
       Say: "I couldn't find information about that topic in this book. This book focuses on Physical AI, humanoid robotics, sensors, and control systems. Would you like to ask about one of those topics?"
    
    5. **NEVER use your training data** for factual answers. Only use Pinecone results.
    
    6. **Output:** Plain text only. No markdown (no **, ##, -, etc).
    
    7. **Context:** You may receive "Previous conversation" - use it for follow-ups.
    """,
    tools=[query_pinecone],
    input_guardrails=[input_guardrail_function],
    model="gpt-4o-mini",
    model_settings=ModelSettings(max_tokens=180)

)


#* Error handler
agent2 = Agent(
    name="Error Handler Agent",
    instructions="""
    Role: : You are the friendly, professional voice of the 'Physical AI & Humanoid Robotics' book assistant.
    **YOUR GOAL:** Explain errors or restrictions politely and briefly.
    **TASKS:**
    1. **Off-Topic:** Acknowledge user's topic, gently refuse, and suggest a robotics topic instead.
    2. **System Error:** Apologize for "temporary interruption" (hide error codes), ask to retry.
    **TONE:** Warm, personalized, brief.
    """,
    model="gpt-4.1-nano",
    model_settings=ModelSettings(max_tokens=80)
)

async def main():
    user_input = ""  # Initialize user_input to avoid reference errors

    try:
        while True:
            user_input = input("User: ")
            if(user_input.lower() == "e"):
                    break
            result = await Runner.run(starting_agent=agent , input=user_input )
            # print("Agent: " + result.final_output)

    except InputGuardrailTripwireTriggered as e :
        print(e , 50*"EEE")
        error_context = f"""
            The user asked: "{user_input}"
            The Input Guardrail blocked this because user asked a off topic question
            Error details (for context only): {e}
            Please write a polite, personalized response to the user explaining this restriction
            and suggesting they ask about the Book instead.
            """
        # Use the error handler agent to provide a user-friendly message
        # try:
        result = await Runner.run(starting_agent=agent2  , input=error_context )
        # except Exception as handler_error:
        #     print(f"Error handler also failed: {handler_error}")
        #     print("Request blocked by content guardrail. Please ask questions related to Physical AI & Humanoid Robotics.")


    except Exception as e:
        # We tell agent2: "A technical error happened."
        error_msg = str(e)
        error_context = f"""
            A system error occurred.
            Error details (for context only): {error_msg}
            The user asked: "{user_input}"
            Please write a friendly apology explaining that the system is temporarily unavailable.
            Do not mention the specific error code.
            """
        # Use the error handler agent for all other errors
        # try:
        result = await Runner.run(starting_agent=agent2  , input=error_context )
            
        # except Exception as handler_error:
        #     print(f"Error handler also failed: {handler_error}")
        #     print("I'm sorry, I encountered an issue while processing your request. Please try again or rephrase your question.")



if __name__ == "__main__":
  asyncio.run(main())