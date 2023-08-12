import { ChatWindow } from "@/components/ChatWindow";

export default function AgentsPage() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        ▲ Next.js + LangChain.js Structured Output 🦜🔗
      </h1>
      <ul>
        <li className="text-l">
          🧱
          <span className="ml-2">
            This template showcases how to output structured responses with a{" "}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{" "}
            chain and the Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>{" "}
            in a{" "}
            <a href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{" "}
            project.
          </span>
        </li>
        <li>
          ☎️
          <span className="ml-2">
            The chain formats the input schema and passes it into an OpenAI
            Functions model, then parses the output.
          </span>
        </li>
        <li className="hidden text-l md:block">
          💻
          <span className="ml-2">
            You can find the prompt, model, and schema logic for this use-case
            in <code>app/api/chat/structured_output/route.ts</code>.
          </span>
        </li>
        <li className="hidden text-l md:block">
          📊
          <span className="ml-2">
            By default, the chain returns an object with <code>tone</code>,{" "}
            <code>word_count</code>, <code>entity</code>,{" "}
            <code>chat_response</code>, and an optional{" "}
            <code>final_punctuation</code>, but you can change it to whatever
            you&apos;d like!
          </span>
        </li>
        <li className="hidden text-l md:block">
          💎
          <span className="ml-2">
            It uses a lightweight, convenient, and powerful{" "}
            <a href="https://zod.dev/" target="_blank">
              schema validation library called Zod
            </a>{" "}
            to define schemas, but you can initialize the chain with JSON schema
            too.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🎨
          <span className="ml-2">
            The main frontend logic is found in{" "}
            <code>app/structured_output/page.tsx</code>.
          </span>
        </li>
        <li className="text-l">
          🐙
          <span className="ml-2">
            This template is open source - you can see the source code and
            deploy your own version{" "}
            <a
              href="https://github.com/langchain-ai/langchain-nextjs-template"
              target="_blank"
            >
              from the GitHub repo
            </a>
            !
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Try typing e.g. <code>What a beautiful day!</code> below!
          </span>
        </li>
      </ul>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat/structured_output"
      emptyStateComponent={InfoCard}
      placeholder={`No matter what you type here, I'll always return the same JSON object with the same structure!`}
      emoji="🧱"
      titleText="Structured Output"
    ></ChatWindow>
  );
}
