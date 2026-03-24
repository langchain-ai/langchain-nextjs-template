import { ChatWindow } from "@/components/ChatWindow";
import { GuideInfoBox } from "@/components/guide/GuideInfoBox";

export default function AgentsPage() {
  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li className="hidden text-l md:block">
          🔗
          <span className="ml-2">
            Trang này minh họa cách thực hiện tra cứu tài liệu (RAG) với{" "}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{" "}
            và Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🪜
          <span className="ml-2">Quy trình hoạt động gồm 2 bước:</span>
          <ul>
            <li className="ml-4">
              1️⃣
              <span className="ml-2">
                Đầu tiên, nó viết lại câu hỏi của bạn thành một câu hỏi độc lập dựa trên lịch sử trò chuyện.
              </span>
            </li>
            <li className="ml-4">
              2️⃣
              <span className="ml-2">
                Sau đó, nó tìm kiếm các đoạn văn bản liên quan trong cơ sở dữ liệu và tổng hợp câu trả lời.
              </span>
            </li>
          </ul>
        </li>
        <li className="hidden text-l md:block">
          💻
          <span className="ml-2">
            Bạn có thể tìm thấy logic prompt và mô hình trong{" "}
            <code>app/api/chat/retrieval/route.ts</code>.
          </span>
        </li>
        <li>
          🏢
          <span className="ml-2">
            Đây là hệ thống hỗ trợ tư vấn sản phẩm TAE Chatbot chuyên nghiệp.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🎨
          <span className="ml-2">
            Logic frontend chính nằm tại{" "}
            <code>app/retrieval/page.tsx</code>.
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Hãy nạp tài liệu sản phẩm, sau đó thử hỏi về giá hoặc thông số kỹ thuật bên dưới!
          </span>
        </li>
      </ul>
    </GuideInfoBox>
  );
  return (
    <ChatWindow
      endpoint="api/chat/retrieval"
      emptyStateComponent={InfoCard}
      showIngestForm={true}
      placeholder={
        'Tôi đã sẵn sàng tra cứu tài liệu! Hãy hỏi tôi về sản phẩm.'
      }
      emoji="🏢"
    />
  );
}
