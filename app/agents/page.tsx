import { ChatWindow } from "@/components/ChatWindow";

export default function AgentsPage() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        BetterMan Agent with Tools🦜🔗
      </h1>
      <ul>
        {/* <li className="text-l">
          🤝
          <span className="ml-2">
            This template showcases a{" "}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{" "}
            agent and the Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>{" "}
            in a{" "}
            <a href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{" "}
            project.
          </span>
        </li> */}
        <li>
          🛠️
          <span className="ml-2">
            The agent has memory and access to a search engine and a calculator & Various other toolkits possibilities coming in the future
          </span>
        </li>
        {/* <li className="hidden text-l md:block">
          💻
          <span className="ml-2">
            You can find the prompt and model logic for this use-case in{" "}
            <code>app/api/chat/agents/route.ts</code>.
          </span>
        </li>
        <li>
          🦜
          <span className="ml-2">
            By default, the agent is pretending to be a talking parrot, but you
            can the prompt to whatever you want!
          </span>
        </li>
        <li className="hidden text-l md:block">
          🎨
          <span className="ml-2">
            The main frontend logic is found in <code>app/agents/page.tsx</code>
            .
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
        </li> */}
        <li className="text-l">
          👇
          <span className="ml-2">
            Try asking e.g. <code>how do I create code to fetch the weather data for Johannesburg and covert to celcius?</code> below!
          </span>
        </li>
      </ul>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat/agents"
      emptyStateComponent={InfoCard}
      placeholder="Hi! I'm a conversational agent! Ask me any technical questions!"
      titleText="AI Agent"
      emoji="🦜"
      showIntermediateStepsToggle={true}
    ></ChatWindow>
  );
}
