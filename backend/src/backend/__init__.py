from fastapi import FastAPI
from google import genai
from pinecone import Pinecone, ServerlessSpec
from agents import Agent , Runner , RunConfig , AsyncOpenAI , OpenAIChatCompletionsModel  , function_tool  , input_guardrail , RunContextWrapper , TResponseInputItem , GuardrailFunctionOutput
from dotenv import load_dotenv
import os
from uuid import uuid4
from pydantic import BaseModel

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
pinecone_api = os.getenv("PINECONE_API_KEY")


if not API_KEY:
    print("API KEY IS NOT FOUND")


app = FastAPI()

#? Google Client for embeddings
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




#! -- the below code is only for addinng data into vector DB this work will be done only one time

#? ---------------------------------------------------------
#? 1. Chunking Function
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
#? 2. Load Content
#? ---------------------------------------------------------


# Go up 4 levels from src/backend/__init__.py to get to the project root
# base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
# content_path = os.path.join(base_dir, "book-content.md")

# if os.path.exists(content_path):
#     with open(content_path, "r", encoding="utf-8") as f:
#         content = f.read()
    
#     chunks_list = text_into_chunks(content)
#     print(f"Successfully loaded {len(chunks_list)} chunks from {content_path}")
# else:
#     print(f"Warning: Content file not found at {content_path}")



#? ---------------------------------------------------------
#? 3. Embedding and Saving (Corrected)
#? ---------------------------------------------------------
#? saving the text and the vector of that text into pinecone data base

# Buffer to store vectors before sending to Pinecone (Batching)
# batch_limit = 100
# vectors_to_upsert = []

# try:

#     count = 0
#     for i , chunk in enumerate(chunks_list): # looping through in chunk in chunk list

#         # --- Correct Gemini API Call ---
#         response = Genai_client.models.embed_content( 
#             contents=chunk, 
#             model="text-embedding-004" 
#             )  
        
#         # -- Correct Response Access ---
#         embeding_vector = response.embeddings[0].values
#         vector_id = str(uuid4())

#         # print("Embedding vectors" , embeding_vector)


#         #? save the text with a unique id and with its resulting vector in a list fo record later on
#         #? this is the record (list) will be sent to pinecone
#         vectors_to_upsert.append((vector_id,  embeding_vector , {'text' : chunk}))
#         # print("embedding list" , vectors_to_upsert)

#         #? Optimization: Upsert in batches of 100 to avoid network lag
#         if len(vectors_to_upsert) >= batch_limit:
#             myIndex.upsert(vectors_to_upsert)
#             vectors_to_upsert = [] # Reset batch
#             print(f"Batch saved. Progress: {i+1}/{len(chunks_list)}")


#    #? Upsert any remaining vectors in the list
#     if vectors_to_upsert:
#         myIndex.upsert(vectors_to_upsert)
#         print("Final batch saved.")

#     print("Success: All data saved in Pinecone.")
        
# except Exception as e:
#     print(f"Error occurred: {e}")


#! ------------------------------------------------------------------



#! Start from here

external_client = AsyncOpenAI(
    base_url="https://generativelanguage.googleapis.com/v1beta/",
    api_key=API_KEY,
)

model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash",
    openai_client=external_client,
)

run_config = RunConfig(
    model=model,
    model_provider = external_client,
)


#? ---------------------------------------------------------
#? 4. Querying Pinecone
#? ---------------------------------------------------------
#? function to retrieve data from pinecone

@function_tool
async def query_pinecone(query_text, top_k=5):
    """
    Converts user query to a Gemini vector and searches Pinecone.
    """
    try:
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
    You are a strict content moderator for a 'Physical AI & Humanoid Robotics' book assistant.
    Analyze the user's input and classify it.

    **ALLOWED TOPICS (is_off_topic = False):**
    1. **Chit-Chat:** Greetings, "Who are you?", "How are you?", "Goodbye".
    2. **Domain Knowledge:** Any question related to AI, Robotics, Physics, Engineering, Mechanics, Sensors, or the book content itself.

    **FORBIDDEN TOPICS (is_off_topic = True):**
    1. **General Knowledge:** History, geography (e.g., "Capital of France"), celebrities, movies.
    2. **Unrelated Tasks:** Writing poems about cats, fixing generic Python code unrelated to robotics, cooking recipes.

    **OUTPUT RULES:**
    - If the input is ALLOWED, set `is_off_topic` to False. Set `reason` to "Allowed".
    - If the input is FORBIDDEN, set `is_off_topic` to True. Set `reason` to a polite refusal message (e.g., "I can only answer questions about Physical AI and Robotics.").
    """,
    output_type=InputClassification
) 


@input_guardrail
async def input_guardrail_function(context:RunContextWrapper[None] ,  agent : Agent , input: str | list[TResponseInputItem]) ->  GuardrailFunctionOutput:
   result = await Runner.run(starting_agent=input_guardrail_agent , input=input , run_config=run_config)
   print("result of input_quardrail_Agent" , result.final_output)

   return GuardrailFunctionOutput(
       tripwire_triggered=result.final_output.is_off_topic,
       output_info=result.final_output.reason
   )



#* Main Agent
agent = Agent(
    name="Consumer Agent",
    instructions=""""
    You are a specialized AI assistant for answering users questions related to the  book "Physical AI & Humanoid Robotics". You have acess to a tool named `query_pinecone` that searches the book's database
    to retrieve relevant information to answer the user's question.

   ## ** Your Task ** :
   1. **Greetings & Identity:** If the user asks "Who are you?", "Hello", or similar chit-chat, answer politely without using any tools. Identify yourself as the assistant for this book.
   2. **Knowledge Questions:** For ANY question requiring information (e.g., "What is physical AI?", "Explain chapter 1"), you MUST use the `query_pinecone` tool to look up the answer.
   3. **Strict Source of Truth:** - After using the tool, answer the user ONLY using the information returned by the tool.
   - If the tool returns no results or empty text, apologize and state that the information is not in the book. 
   - DO NOT use your internal training data to answer general knowledge questions (e.g., if asked "What is the capital of France?", and it's not in the book, you must say you don't know or I can't help you with that).

     """,
    tools=[query_pinecone],
    input_guardrails=[input_guardrail_function]
    
)

def main():
    while True:
        user_input = input("User: ")
        if(user_input.lower() == "e"):
            break
        result = Runner.run_sync(starting_agent=agent , input=user_input ,run_config=run_config)
        print("Agent: " + result.final_output)
