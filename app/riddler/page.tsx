import { ChatWindow } from "@/components/ChatWindowRiddle";

export default function Home() {
  const InfoCard = (
   
    <div className="p-4 md:p-8 rounded  w-full max-h-[85%] overflow-hidden">
       <link rel="shortcut icon" href="images/favicon.png" />
      <h1 className="text-3xl md:text-4xl mb-4">
      Mysterio the riddle master 🤔
      </h1>
      <ul>
        <li>
         🤔
          <span className="ml-2">
            This bot will ask riddles
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Try asking e.g. <code>Give me a challenging riddle involving ducks</code> below!
          </span>
        </li>
      </ul>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat/riddle_agent"
      emoji="🤔"
      titleText="Mysterio the riddle master"
      placeholder="I'm an LLM who loves riddles! Ask me for a riddle!"
      emptyStateComponent={InfoCard}
    ></ChatWindow>
  );
}
