import { ChatWindow } from "@/components/ChatWindow";
import { GuideInfoBox } from "@/components/guide/GuideInfoBox";

export default function Home() {
  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li className="text-l">
          🤝 AVWX Chat
         
        </li>
      </ul>
    </GuideInfoBox>
  );
  return (
    <ChatWindow
      endpoint="api/chat/avwx"
      emoji="🏴‍☠️"
      placeholder="I'm an LLM here to answer aviation weather questions"
      emptyStateComponent={InfoCard}
    />
  );
}
