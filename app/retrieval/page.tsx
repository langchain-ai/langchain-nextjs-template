import { ChatWindow } from "@/components/ChatWindow";

export default function AgentsPage() {
  const InfoCard = (
    <div className="p-8 rounded bg-[#25252d]">
      <h1 className="text-4xl mb-4">▲ Next.js + LangChain.js Retrieval Chain 🦜🔗</h1>
      <ul>
        <li className="text-l">
          🔗
          <span className="ml-2">
            This template showcases how to perform retrieval with a{" "}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{" "}
            chain in a{" "}
            <a href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{" "}
            project.
          </span>
        </li>
        <li>
          🪜
          <span className="ml-2">
            The chain works in two steps:
          </span>
          <ul>
            <li className="ml-4">1️⃣<span className="ml-2">First, it rephrases the input question into a "standalone" question, dereferencing pronouns based on the chat history.</span></li>
            <li className="ml-4">2️⃣<span className="ml-2">Then, it queries the retriever for documents similar to the dereferenced question and composes an answer.</span></li>
          </ul>
        </li>
        <li className="text-l">
          🔁
          <span className="ml-2">
            It uses the Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>{" "}
            for streaming HTTP responses and the UI.
          </span>
        </li>
        <li className="text-l">
          💻
          <span className="ml-2">
            You can find the prompt and model logic for this use-case in{" "}
            <code>app/api/chat/retrieval/route.ts</code>.
          </span>
        </li>
        <li>
          🐶
          <span className="ml-2">
            By default, the agent is pretending to be a talking puppy, but you
            can change the prompt to whatever you want!
          </span>
        </li>
        <li className="text-l">
          🎨
          <span className="ml-2">
            The main frontend logic is found in <code>app/retrieval/page.tsx</code>
            .
          </span>
        </li>
        <li className="text-l">
          👇<span className="ml-2">Try asking, "What are some ways of doing retrieval in LangChain?" or another question below!</span>
        </li>
      </ul>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat/retrieval"
      emptyStateComponent={InfoCard}
      showIngestForm={true}
      placeholder={
        'I\'m a dog with a nose for finding the right documents! Ask, "What are some ways of doing retrieval in LangChain.js?"'
      }
      titleText="🐶 Dana the Document-Retrieving Dog"
    ></ChatWindow>
  );
}
