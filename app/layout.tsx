import "./globals.css";
import { Public_Sans } from "next/font/google";
import { ActiveLink } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const publicSans = Public_Sans({ subsets: ["latin"] });

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 240 41"
    className="h-8 flex-shrink-0 self-start"
  >
    <path
      fill="currentColor"
      d="M61.514 11.157a3.943 3.943 0 0 0-2.806 1.158l-3.018 3.01a3.951 3.951 0 0 0-1.147 3.095l.019.191a3.894 3.894 0 0 0 1.128 2.314c.435.434.914.709 1.496.9.03.175.047.352.047.53 0 .797-.31 1.546-.874 2.107l-.186.186c-1.008-.344-1.848-.847-2.607-1.604a6.888 6.888 0 0 1-1.927-3.67l-.034-.193-.153.124a3.675 3.675 0 0 0-.294.265l-3.018 3.01a3.957 3.957 0 0 0 2.807 6.757 3.959 3.959 0 0 0 2.806-1.158l3.019-3.01a3.958 3.958 0 0 0 0-5.599 3.926 3.926 0 0 0-1.462-.92 3.252 3.252 0 0 1 .924-2.855 6.883 6.883 0 0 1 2.664 1.656 6.906 6.906 0 0 1 1.926 3.67l.035.193.153-.124c.104-.083.202-.173.296-.267l3.018-3.01a3.956 3.956 0 0 0-2.808-6.756h-.004Z"
    />
    <path
      fill="currentColor"
      d="M59.897.149h-39.49C9.153.149 0 9.279 0 20.5c0 11.222 9.154 20.351 20.406 20.351h39.49c11.253 0 20.407-9.13 20.407-20.35C80.303 9.277 71.149.148 59.897.148ZM40.419 32.056c-.651.134-1.384.158-1.882-.36-.183.42-.612.199-.943.144-.03.085-.057.16-.085.246-1.1.073-1.925-1.046-2.449-1.89-1.04-.562-2.222-.904-3.285-1.492-.062.968.15 2.17-.774 2.794-.047 1.862 2.824.22 3.088 1.608-.204.022-.43-.033-.594.124-.749.726-1.608-.55-2.471-.023-1.16.582-1.276 1.059-2.71 1.179-.08-.12-.047-.2.02-.273.404-.468.433-1.02 1.122-1.22-.71-.111-1.303.28-1.901.59-.778.317-.772-.717-1.968.054-.132-.108-.069-.206.007-.289.304-.37.704-.425 1.155-.405-2.219-1.233-3.263 1.508-4.288.145-.308.081-.424.358-.618.553-.167-.183-.04-.405-.033-.62-.2-.094-.453-.139-.394-.459-.391-.132-.665.1-.957.32-.263-.203.178-.5.26-.712.234-.407.769-.084 1.04-.377.772-.437 1.847.273 2.729.153.68.085 1.52-.61 1.179-1.305-.726-.926-.598-2.137-.614-3.244-.09-.645-1.643-1.467-2.092-2.163-.555-.627-.987-1.353-1.42-2.068-1.561-3.014-1.07-6.886-3.037-9.685-.89.49-2.048.259-2.816-.399-.414.377-.432.87-.465 1.392-.994-.99-.87-2.863-.075-3.966a5.276 5.276 0 0 1 1.144-1.11c.098-.07.131-.14.129-.25.786-3.524 6.144-2.845 7.838-.348 1.229 1.537 1.6 3.57 2.994 4.997 1.875 2.047 4.012 3.85 5.742 6.03 1.637 1.992 2.806 4.328 3.826 6.683.416.782.42 1.74 1.037 2.408.304.403 1.79 1.5 1.467 1.888.186.403 1.573.959 1.092 1.35h.002Zm26.026-12.024-3.018 3.01a6.955 6.955 0 0 1-2.875 1.728l-.056.016-.02.053a6.865 6.865 0 0 1-1.585 2.446l-3.019 3.01a6.936 6.936 0 0 1-4.932 2.035 6.936 6.936 0 0 1-4.932-2.035 6.95 6.95 0 0 1 0-9.838l3.018-3.01a6.882 6.882 0 0 1 2.871-1.721l.055-.017.02-.053a6.932 6.932 0 0 1 1.59-2.454l3.019-3.01a6.936 6.936 0 0 1 4.932-2.035c1.865 0 3.616.723 4.932 2.035a6.898 6.898 0 0 1 2.04 4.92c0 1.86-.724 3.607-2.04 4.918v.002Z"
    />
    <path
      fill="currentColor"
      d="M28.142 28.413c-.265 1.03-.35 2.782-1.694 2.832-.11.595.413.819.89.627.472-.215.696.171.855.556.729.106 1.806-.242 1.847-1.103-1.088-.625-1.424-1.813-1.896-2.914l-.002.002ZM99.209 10.816h-3.585v21.746H111v-3.464H99.209V10.816ZM129.021 32.562h3.585v-.038h.047l.007-.16c.001-.047.014-.482-.052-1.152v-8.094c0-3.045 2.22-4.43 4.283-4.43 2.219 0 3.299 1.195 3.299 3.657v10.217h3.585V21.867c0-4.062-2.581-6.586-6.734-6.586-1.765 0-3.34.502-4.577 1.454l-.033-1.156h-3.405v16.983h-.005ZM158.365 16.827c-1.246-1.012-2.848-1.546-4.655-1.546-4.834 0-7.837 3.334-7.837 8.7s3.003 8.73 7.837 8.73c1.705 0 3.227-.465 4.426-1.348-.103 2.632-1.752 4.196-4.455 4.196-2.273 0-3.559-.724-3.823-2.15l-.033-.178-3.483 1.063.031.143c.588 2.835 3.241 4.528 7.1 4.528 2.618 0 4.671-.713 6.104-2.12 1.446-1.418 2.178-3.462 2.178-6.073V15.579h-3.316l-.072 1.248h-.002Zm-.224 7.303c0 3.24-1.578 5.176-4.223 5.176-2.835 0-4.46-1.94-4.46-5.324 0-3.383 1.626-5.295 4.46-5.295 2.581 0 4.197 1.926 4.223 5.026v.418ZM179.418 25.666c-.743 2.404-2.651 3.729-5.371 3.729-3.889 0-6.307-2.953-6.307-7.707 0-4.753 2.439-7.706 6.367-7.706 2.718 0 4.284 1.065 5.081 3.453l.372 1.117 3.385-1.59-.318-.894c-1.289-3.632-4.266-5.55-8.609-5.55-2.951 0-5.456 1.065-7.245 3.08-1.77 1.996-2.707 4.792-2.707 8.092 0 6.786 3.917 11.172 9.981 11.172 4.273 0 7.583-2.236 8.853-5.982l.324-.957-3.477-1.322-.331 1.067.002-.002ZM192.806 15.281c-1.712 0-3.235.47-4.431 1.36V8.733h-3.585v23.832h3.585V23.12c0-3.064 2.219-4.46 4.283-4.46 2.219 0 3.299 1.196 3.299 3.657v10.249h3.585V21.84c0-3.983-2.643-6.556-6.734-6.556l-.002-.003ZM220.496 8.22c-1.332 0-2.299.967-2.299 2.298 0 1.332.967 2.299 2.299 2.299 1.331 0 2.298-.967 2.298-2.299 0-1.331-.967-2.298-2.298-2.298ZM233.262 15.281c-1.765 0-3.339.502-4.576 1.454l-.034-1.156h-3.404v16.983h3.585v-9.444c0-3.045 2.219-4.43 4.283-4.43 2.219 0 3.299 1.195 3.299 3.657v10.217H240V21.867c0-4.062-2.581-6.586-6.734-6.586h-.004ZM222.237 15.58h-3.567v8.418c-.99-.831-2.156-1.46-3.472-1.871v-.856c0-3.75-2.462-5.99-6.587-5.99-3.351 0-5.857 1.574-6.878 4.315l-.275.74 2.874 2.118.493-1.285c.65-1.694 1.854-2.483 3.786-2.483 1.933 0 3.002.93 3.002 2.762v.096a12.075 12.075 0 0 0-.347-.01c-3.838-.061-6.638.836-8.322 2.664-1.723 1.87-1.572 3.97-1.549 4.202l.016.162h.016c.268 2.616 2.553 4.295 5.874 4.295 1.829 0 3.519-.509 4.797-1.44l.014 1.144h3.086v-5.313l-.067-.048c-.436-.32-1.197-.732-2.342-.877a7.087 7.087 0 0 0-1.018-.061h-.16v.488c0 1.123-1.291 2.705-4.163 2.705-2.12 0-2.436-.892-2.436-1.424v-.054c.016-.239.116-.823.643-1.366.669-.691 2.175-1.5 5.552-1.449 2.445.039 4.321.722 5.577 2.033 1.541 1.608 1.831 3.81 1.884 4.673v.694h3.567V15.58h.002ZM119.752 15.207c-3.351 0-5.857 1.573-6.878 4.315l-.275.74 2.874 2.118.493-1.285c.65-1.694 1.854-2.484 3.786-2.484 1.933 0 3.002.93 3.002 2.763v.43l-3.692.652c-4.328.765-6.523 2.616-6.523 5.498s2.316 4.83 5.901 4.83c1.83 0 3.519-.51 4.797-1.44l.015 1.143h3.085v-11.29c0-3.751-2.462-5.99-6.586-5.99h.001Zm3.002 9.957v1.513c0 1.124-1.292 2.705-4.164 2.705-2.12 0-2.435-.891-2.435-1.423 0-.473 0-1.578 3.755-2.275l2.844-.519v-.001Z"
    />
  </svg>
);

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
        <NuqsAdapter>
          <div className="bg-secondary grid grid-rows-[auto,1fr] h-[100dvh]">
            <div className="grid grid-cols-[1fr,auto] gap-2 p-4">
              <div className="flex gap-4 flex-col md:flex-row md:items-center">
                <a
                  href="https://js.langchain.com"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <Logo />
                </a>
                <nav className="flex gap-1 flex-col md:flex-row">
                  <ActiveLink href="/">🏴‍☠️ Chat</ActiveLink>
                  <ActiveLink href="/structured_output">
                    🧱 Structured Output
                  </ActiveLink>
                  <ActiveLink href="/agents">🦜 Agents</ActiveLink>
                  <ActiveLink href="/retrieval">🐶 Retrieval</ActiveLink>
                  <ActiveLink href="/retrieval_agents">
                    🤖 Retrieval Agents
                  </ActiveLink>
                  <ActiveLink href="/ai_sdk">
                    🌊 React Server Components
                  </ActiveLink>
                  <ActiveLink href="/langgraph">🕸️ LangGraph</ActiveLink>
                </nav>
              </div>

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
        </NuqsAdapter>
      </body>
    </html>
  );
}
