import { GuideInfoBox } from "@/components/guide/GuideInfoBox";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ExternalLinkSVG = ({
  height,
  width,
  className,
}: {
  height: number;
  width: number;
  className?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g id="Interface / External_Link">
      <path
        id="Vector"
        d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const STREAM_EVENTS_API_URL =
  "https://v02.api.js.langchain.com/classes/langchain_core_language_models_base.BaseLangChain.html#streamEvents";

export default function Home() {
  return (
    <div className="py-8">
      <GuideInfoBox>
        <div className="flex flex-col gap-4 items-stretch">
          <p>
            The below section contains two examples using the LangChain.js
            framework, along with helper functions from the experimental AI SDK
            RSC showing off how to create complex, full stack streaming
            applications with React Server Components.
          </p>

          <div className="grid grid-cols-[1fr,auto] items-center gap-x-2 gap-y-6">
            <p className="text-left m-0">
              The <strong>Agents</strong> example contains an agent which
              streams data back to the client using the{" "}
              <a
                href={STREAM_EVENTS_API_URL}
                target="blank"
                className="inline-flex items-center gap-1 underline"
              >
                streamEvents
                <ExternalLinkSVG className="inline" height={12} width={12} />
              </a>{" "}
              API.
            </p>

            <Button asChild variant="outline">
              <Link href="/ai_sdk/agent">
                <span>Go to Agents</span>
                <ExternalLinkSVG className="inline" height={16} width={16} />
              </Link>
            </Button>

            <p className="text-left m-0">
              The <strong>Tools</strong> example shows how to invoke a simple
              tool calling model, and stream back the result.
            </p>

            <Button asChild variant="outline">
              <Link href="/ai_sdk/tools">
                <span>Go to Tools</span>
                <ExternalLinkSVG className="inline" height={16} width={16} />
              </Link>
            </Button>
          </div>
        </div>
      </GuideInfoBox>
    </div>
  );
}
