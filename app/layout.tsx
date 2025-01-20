import "./globals.css";
import { Public_Sans } from "next/font/google";
import { ActiveLink } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>LangChain + Next.js Template</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="Starter template showing how to use LangChain in Next.js projects. See source code and deploy your own at https://github.com/langchain-ai/langchain-nextjs-template!"
        />
        <meta property="og:title" content="LangChain + Next.js Template" />
        <meta
          property="og:description"
          content="Starter template showing how to use LangChain in Next.js projects. See source code and deploy your own at https://github.com/langchain-ai/langchain-nextjs-template!"
        />
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LangChain + Next.js Template" />
        <meta
          name="twitter:description"
          content="Starter template showing how to use LangChain in Next.js projects. See source code and deploy your own at https://github.com/langchain-ai/langchain-nextjs-template!"
        />
        <meta name="twitter:image" content="/images/og-image.png" />
      </head>
      <body className={publicSans.className}>
        <div className="bg-secondary grid grid-rows-[auto,1fr] h-[100dvh]">
          <div className="grid grid-cols-[1fr,auto] gap-2 p-4">
            <nav className="flex gap-1">
              <ActiveLink href="/">🏴‍☠️ Chat</ActiveLink>
              <ActiveLink href="/structured_output">
                🧱 Structured Output
              </ActiveLink>
              <ActiveLink href="/agents">🦜 Agents</ActiveLink>
              <ActiveLink href="/retrieval">🐶 Retrieval</ActiveLink>
              <ActiveLink href="/retrieval_agents">
                🤖 Retrieval Agents
              </ActiveLink>
              <ActiveLink href="/ai_sdk">🌊 LangChain x AI SDK RSC</ActiveLink>
            </nav>

            <div className="flex justify-center">
              <Button asChild variant="outline" size="default">
                <a
                  href="https://github.com/langchain-ai/langchain-nextjs-template"
                  target="_blank"
                >
                  <GithubIcon className="size-3" />
                  <span>Open in GitHub</span>
                </a>
              </Button>
            </div>
          </div>
          <div className="bg-background mx-4 relative grid rounded-t-2xl border border-input border-b-0">
            <div className="absolute inset-0">{children}</div>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
