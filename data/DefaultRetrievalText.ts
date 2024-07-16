export default `# QA and Chat over Documents

Chat and Question-Answering (QA) over \`data\` are popular LLM use-cases.

\`data\` can include many things, including:

* \`Unstructured data\` (e.g., PDFs)
* \`Structured data\` (e.g., SQL)
* \`Code\` (e.g., Python)

Below we will review Chat and QA on \`Unstructured data\`.

![intro.png](/img/qa_intro.png)

\`Unstructured data\` can be loaded from many sources.

Check out the [document loader integrations here](/docs/modules/data_connection/document_loaders/) to browse the set of supported loaders.

Each loader returns data as a LangChain \`Document\`.

\`Documents\` are turned into a Chat or QA app following the general steps below:

* \`Splitting\`: [Text splitters](/docs/modules/data_connection/document_transformers/) break \`Documents\` into splits of specified size
* \`Storage\`: Storage (e.g., often a [vectorstore](/docs/modules/data_connection/vectorstores/)) will house [and often embed](https://www.pinecone.io/learn/vector-embeddings/) the splits
* \`Retrieval\`: The app retrieves splits from storage (e.g., often [with similar embeddings](https://www.pinecone.io/learn/k-nearest-neighbor/) to the input question)
* \`Output\`: An [LLM](/docs/modules/model_io/models/llms/) produces an answer using a prompt that includes the question and the retrieved splits

![flow.jpeg](/img/qa_flow.jpeg)

## Quickstart

Let's load this [blog post](https://lilianweng.github.io/posts/2023-06-23-agent/) on agents as an example \`Document\`.

We'll have a QA app in a few lines of code.

First, set environment variables and install packages required for the guide:

\`\`\`shell
> yarn add cheerio
# Or load env vars in your preferred way:
> export OPENAI_API_KEY="..."
\`\`\`

## 1. Loading, Splitting, Storage

### 1.1 Getting started

Specify a \`Document\` loader.

\`\`\`typescript
// Document loader
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

const loader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/"
);
const data = await loader.load();
\`\`\`

Split the \`Document\` into chunks for embedding and vector storage.


\`\`\`typescript
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 0,
});

const splitDocs = await textSplitter.splitDocuments(data);
\`\`\`

Embed and store the splits in a vector database (for demo purposes we use an unoptimized, in-memory example but you can [browse integrations here](/docs/modules/data_connection/vectorstores/integrations/)):


\`\`\`typescript
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const embeddings = new OpenAIEmbeddings();

const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
\`\`\`

Here are the three pieces together:

![lc.png](/img/qa_data_load.png)

### 1.2 Going Deeper

#### 1.2.1 Integrations

\`Document Loaders\`

* Browse document loader integrations [here](/docs/modules/data_connection/document_loaders/).

* See further documentation on loaders [here](/docs/modules/data_connection/document_loaders/).

\`Document Transformers\`

* All can ingest loaded \`Documents\` and process them (e.g., split).

* See further documentation on transformers [here](/docs/modules/data_connection/document_transformers/).

\`Vectorstores\`

* Browse vectorstore integrations [here](/docs/modules/data_connection/vectorstores/integrations/).

* See further documentation on vectorstores [here](/docs/modules/data_connection/vectorstores/).

## 2. Retrieval

### 2.1 Getting started

Retrieve [relevant splits](https://www.pinecone.io/learn/what-is-similarity-search/) for any question using \`similarity_search\`.


\`\`\`typescript
const relevantDocs = await vectorStore.similaritySearch("What is task decomposition?");

console.log(relevantDocs.length);

// 4
\`\`\`


### 2.2 Going Deeper

#### 2.2.1 Retrieval

Vectorstores are commonly used for retrieval.

But, they are not the only option.

For example, SVMs (see thread [here](https://twitter.com/karpathy/status/1647025230546886658?s=20)) can also be used.

LangChain [has many retrievers and retrieval methods](/docs/modules/data_connection/retrievers/) including, but not limited to, vectorstores.

All retrievers implement some common methods, such as \`getRelevantDocuments()\`.


## 3. QA

### 3.1 Getting started

Distill the retrieved documents into an answer using an LLM (e.g., \`gpt-3.5-turbo\`) with \`RetrievalQA\` chain.


\`\`\`typescript
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";

const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });
const chain = RetrievalQAChain.fromLLM(model, vectorstore.asRetriever());

const response = await chain.call({
  query: "What is task decomposition?"
});
console.log(response);

/*
  {
    text: 'Task decomposition refers to the process of breaking down a larger task into smaller, more manageable subgoals. By decomposing a task, it becomes easier for an agent or system to handle complex tasks efficiently. Task decomposition can be done through various methods such as using prompting or task-specific instructions, or through human inputs. It helps in planning and organizing the steps required to complete a task effectively.'
  }
*/
\`\`\`

### 3.2 Going Deeper

#### 3.2.1 Integrations

\`LLMs\`

* Browse LLM integrations and further documentation [here](/docs/modules/model_io/models/).

#### 3.2.2 Customizing the prompt

The prompt in \`RetrievalQA\` chain can be customized as follows.


\`\`\`typescript
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

const template = \`Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.
Always say "thanks for asking!" at the end of the answer.
{context}
Question: {question}
Helpful Answer:\`;

const chain = RetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), {
  prompt: PromptTemplate.fromTemplate(template),
});

const response = await chain.call({
  query: "What is task decomposition?"
});

console.log(response);

/*
  {
    text: 'Task decomposition is the process of breaking down a large task into smaller, more manageable subgoals. This allows for efficient handling of complex tasks and aids in planning and organizing the steps needed to achieve the overall goal. Thanks for asking!'
  }
*/
\`\`\`


#### 3.2.3 Returning source documents

The full set of retrieved documents used for answer distillation can be returned using \`return_source_documents=True\`.


\`\`\`typescript
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";

const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

const chain = RetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), {
  returnSourceDocuments: true
});

const response = await chain.call({
  query: "What is task decomposition?"
});

console.log(response.sourceDocuments[0]);

/*
Document {
  pageContent: 'Task decomposition can be done (1) by LLM with simple prompting like "Steps for XYZ.\\n1.", "What are the subgoals for achieving XYZ?", (2) by using task-specific instructions; e.g. "Write a story outline." for writing a novel, or (3) with human inputs.',
  metadata: [Object]
}
*/
\`\`\`


#### 3.2.4 Customizing retrieved docs in the LLM prompt

Retrieved documents can be fed to an LLM for answer distillation in a few different ways.

\`stuff\`, \`refine\`, and \`map-reduce\` chains for passing documents to an LLM prompt are well summarized [here](/docs/modules/chains/document/).

\`stuff\` is commonly used because it simply "stuffs" all retrieved documents into the prompt.

The [loadQAChain](/docs/modules/chains/document/) methods are easy ways to pass documents to an LLM using these various approaches.


\`\`\`typescript
import { loadQAStuffChain } from "langchain/chains";

const stuffChain = loadQAStuffChain(model);

const stuffResult = await stuffChain.call({
  input_documents: relevantDocs,
  question: "What is task decomposition
});

console.log(stuffResult);
/*
{
  text: 'Task decomposition is the process of breaking down a large task into smaller, more manageable subgoals or steps. This allows for efficient handling of complex tasks by focusing on one subgoal at a time. Task decomposition can be done through various methods such as using simple prompting, task-specific instructions, or human inputs.'
}
*/
\`\`\`

## 4. Chat

### 4.1 Getting started

To keep chat history, we use a variant of the previous chain called a \`ConversationalRetrievalQAChain\`.
First, specify a \`Memory buffer\` to track the conversation inputs / outputs.


\`\`\`typescript
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";

const memory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
});
\`\`\`

Next, we initialize and call the chain:

\`\`\`typescript
const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });
const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), {
  memory
});

const result = await chain.call({
  question: "What are some of the main ideas in self-reflection?"
});
console.log(result);

/*
{
  text: 'Some main ideas in self-reflection include:\n' +
    '\n' +
    '1. Iterative Improvement: Self-reflection allows autonomous agents to improve by continuously refining past action decisions and correcting mistakes.\n' +
    '\n' +
    '2. Trial and Error: Self-reflection plays a crucial role in real-world tasks where trial and error are inevitable. It helps agents learn from failed trajectories and make adjustments for future actions.\n' +
    '\n' +
    '3. Constructive Criticism: Agents engage in constructive self-criticism of their big-picture behavior to identify areas for improvement.\n' +
    '\n' +
    '4. Decision and Strategy Refinement: Reflection on past decisions and strategies enables agents to refine their approach and make more informed choices.\n' +
    '\n' +
    '5. Efficiency and Optimization: Self-reflection encourages agents to be smart and efficient in their actions, aiming to complete tasks in the least number of steps.\n' +
    '\n' +
    'These ideas highlight the importance of self-reflection in enhancing performance and guiding future actions.'
}
*/
\`\`\`


The \`Memory buffer\` has context to resolve \`"it"\` ("self-reflection") in the below question.


\`\`\`typescript
const followupResult = await chain.call({
  question: "How does the Reflexion paper handle it?"
});
console.log(followupResult);

/*
{
  text: "The Reflexion paper introduces a framework that equips agents with dynamic memory and self-reflection capabilities to improve their reasoning skills. The approach involves showing the agent two-shot examples, where each example consists of a failed trajectory and an ideal reflection on how to guide future changes in the agent's plan. These reflections are then added to the agent's working memory as context for querying a language model. The agent uses this self-reflection information to make decisions on whether to start a new trial or continue with the current plan."
}
*/
\`\`\`


### 4.2 Going deeper

The [documentation](/docs/modules/chains/popular/chat_vector_db) on \`ConversationalRetrievalQAChain\` offers a few extensions, such as streaming and source documents.


# Conversational Retrieval Agents

This is an agent specifically optimized for doing retrieval when necessary while holding a conversation and being able
to answer questions based on previous dialogue in the conversation.

To start, we will set up the retriever we want to use, then turn it into a retriever tool. Next, we will use the high-level constructor for this type of agent.
Finally, we will walk through how to construct a conversational retrieval agent from components.

## The Retriever

To start, we need a retriever to use! The code here is mostly just example code. Feel free to use your own retriever and skip to the next section on creating a retriever tool.

\`\`\`typescript
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const loader = new TextLoader("state_of_the_union.txt");
const docs = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 0
});

const texts = await splitter.splitDocuments(docs);

const vectorStore = await FaissStore.fromDocuments(texts, new OpenAIEmbeddings());

const retriever = vectorStore.asRetriever();
\`\`\`

## Retriever Tool

Now we need to create a tool for our retriever. The main things we need to pass in are a \`name\` for the retriever as well as a \`description\`. These will both be used by the language model, so they should be informative.

\`\`\`typescript
import { createRetrieverTool } from "langchain/agents/toolkits";

const tool = createRetrieverTool(retriever, {
  name: "search_state_of_union",
  description: "Searches and returns documents regarding the state-of-the-union.",
});
\`\`\`

## Agent Constructor

Here, we will use the high level \`create_conversational_retrieval_agent\` API to construct the agent.
Notice that beside the list of tools, the only thing we need to pass in is a language model to use.

Under the hood, this agent is using the OpenAIFunctionsAgent, so we need to use an ChatOpenAI model.

\`\`\`typescript
import { createConversationalRetrievalAgent } from "langchain/agents/toolkits";
import { ChatOpenAI } from "langchain/chat_models/openai";

const model = new ChatOpenAI({
  temperature: 0,
});

const executor = await createConversationalRetrievalAgent(model, [tool], {
  verbose: true,
});
\`\`\`

We can now try it out!

\`\`\`typescript
const result = await executor.call({
  input: "Hi, I'm Bob!"
});

console.log(result);

/*
  {
    output: 'Hello Bob! How can I assist you today?',
    intermediateSteps: []
  }
*/

const result2 = await executor.call({
  input: "What's my name?"
});

console.log(result2);

/*
  { output: 'Your name is Bob.', intermediateSteps: [] }
*/

const result3 = await executor.call({
  input: "What did the president say about Ketanji Brown Jackson in the most recent state of the union?"
});

console.log(result3);

/*
  {
    output: "In the most recent state of the union, President Biden mentioned Ketanji Brown Jackson. He nominated her as a Circuit Court of Appeals judge and described her as one of the nation's top legal minds who will continue Justice Breyer's legacy of excellence. He mentioned that she has received a broad range of support, including from the Fraternal Order of Police and former judges appointed by Democrats and Republicans.",
    intermediateSteps: [
      {...}
    ]
  }
*/

const result4 = await executor.call({
  input: "How long ago did he nominate her?"
});

console.log(result4);

/*
  {
    output: 'President Biden nominated Ketanji Brown Jackson four days before the most recent state of the union address.',
    intermediateSteps: []
  }
*/
\`\`\`

Note that for the final call, the agent used previously retrieved information to answer the query and did not need to call the tool again!

Here's a trace showing how the agent fetches documents to answer the question with the retrieval tool:

https://smith.langchain.com/public/1e2b1887-ca44-4210-913b-a69c1b8a8e7e/r

## Creating from components

What actually is going on underneath the hood? Let's take a look so we can understand how to modify things going forward.

### Memory

In this example, we want the agent to remember not only previous conversations, but also previous intermediate steps.
For that, we can use \`OpenAIAgentTokenBufferMemory\`. Note that if you want to change whether the agent remembers intermediate steps,
how the long the retained buffer is, or anything like that you should change this part.

\`\`\`typescript
import { OpenAIAgentTokenBufferMemory } from "langchain/agents/toolkits";

const memory = new OpenAIAgentTokenBufferMemory({
  llm: model,
  memoryKey: "chat_history",
  outputKey: "output"
});
\`\`\`

You should make sure \`memoryKey\` is set to \`"chat_history"\` and \`outputKey\` is set to \`"output"\` for the OpenAI functions agent.
This memory also has \`returnMessages\` set to \`true\` by default.

You can also load messages from prior conversations into this memory by initializing it with a pre-loaded chat history:

\`\`\`typescript
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIAgentTokenBufferMemory } from "langchain/agents/toolkits";
import { HumanMessage, AIMessage } from "langchain/schema";
import { ChatMessageHistory } from "langchain/memory";

const previousMessages = [
  new HumanMessage("My name is Bob"),
  new AIMessage("Nice to meet you, Bob!"),
];

const chatHistory = new ChatMessageHistory(previousMessages);

const memory = new OpenAIAgentTokenBufferMemory({
  llm: new ChatOpenAI({}),
  memoryKey: "chat_history",
  outputKey: "output",
  chatHistory,
});
\`\`\`

### Agent executor

We can recreate the agent executor directly with the \`initializeAgentExecutorWithOptions\` method.
This allows us to customize the agent's system message by passing in a \`prefix\` into \`agentArgs\`.
Importantly, we must pass in \`return_intermediate_steps: true\` since we are recording that with our memory object.

\`\`\`typescript
import { initializeAgentExecutorWithOptions } from "langchain/agents";

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: "openai-functions",
  memory,
  returnIntermediateSteps: true,
  agentArgs: {
    prefix:
      prefix ??
      \`Do your best to answer the questions. Feel free to use any tools available to look up relevant information, only if necessary.\`,
  },
});
\`\`\`
`;