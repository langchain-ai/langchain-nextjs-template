import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        Chat-GPT + Prompt Template 🤔
      </h1>
      <ul>
        <li className="text-l">
          👇
          <span className="ml-2">
            Try asking e.g. <code>Give me a riddle involving birds</code> below!
          </span>
        </li>
      </ul>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat"
      emoji="🤔"
      titleText="Mysterio the Riddler"
      placeholder="I'm an LLM prompted to tell riddles, ask me for a riddle!"
      emptyStateComponent={InfoCard}
    ></ChatWindow>
  );
}
