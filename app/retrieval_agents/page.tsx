import { ChatWindow } from "@/components/ChatWindow";
import { GuideInfoBox } from "@/components/guide/GuideInfoBox";

export default function AgentsPage() {
  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li className="hidden text-l md:block">
          🤝
          <span className="ml-2">
            Trang này minh họa khả năng của một{" "}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{" "}
            Retriever Agent kết hợp với Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🛠️
          <span className="ml-2">
            Đại lý (Agent) có quyền truy cập vào công cụ tra cứu dữ liệu (Vector Store) 
            và có bộ nhớ để theo dõi cuộc trò chuyện. Nó tự động quyết định khi nào cần tra cứu thông tin.
          </span>
        </li>
        <li className="hidden text-l md:block">
          💻
          <span className="ml-2">
            Bạn có thể tìm thấy logic prompt và mô hình trong{" "}
            <code>app/api/chat/retrieval_agents/route.ts</code>.
          </span>
        </li>
        <li>
          🤖
          <span className="ml-2">
            Mặc định, đây là một Trợ lý Bán hàng Thông minh giúp tra cứu sản phẩm và kỹ thuật.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🎨
          <span className="ml-2">
            Logic frontend chính nằm tại{" "}
            <code>app/retrieval_agents/page.tsx</code>.
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Hãy nạp tài liệu (Markdown/Text), sau đó thử hỏi về giá hoặc thông số sản phẩm bên dưới!
          </span>
        </li>
      </ul>
    </GuideInfoBox>
  );

  return (
    <ChatWindow
      endpoint="api/chat/retrieval_agents"
      emptyStateComponent={InfoCard}
      showIngestForm={true}
      showIntermediateStepsToggle={true}
      placeholder={
        'Tôi là Trợ lý Bán hàng Thông minh! Hãy hỏi tôi về sản phẩm của bạn.'
      }
      emoji="🤖"
    />
  );
}
