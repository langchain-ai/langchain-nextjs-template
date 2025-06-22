import "./globals.css";
import { Public_Sans } from "next/font/google";
import { ActiveLink } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const publicSans = Public_Sans({ subsets: ["latin"] });

const Logo = () => (
  <svg
   xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 240 41"
    className="h-8 flex-shrink-0 self-start"
    id="svg2"><defs
     id="defs6"><clipPath
       id="clipPath20"
       clipPathUnits="userSpaceOnUse"><path
         id="path22"
         d="M 0,792 612,792 612,0 0,0 0,792 Z" /></clipPath></defs><g
     transform="matrix(1.3333333,0,0,-1.3333333,0,1056)"
     id="g10"><g
       transform="translate(218.5,525.25)"
       id="g12"><path
         id="path14"
         style={{fill:"#373535", fillOpacity:1, fillRule:"evenodd", stroke:"none"}}
         d="m 0,0 207.031,0 0,65.741 L 0,65.741 -8.75,35 0,0 Z" /></g><g
       id="g16"><g
         clip-path="url(#clipPath20)"
         id="g18"><g
           transform="translate(94.875,590.9911)"
           id="g24"><path
             id="path26"
             style={{fill:"#84bf4d", fillOpacity:1, fillRule:"nonzero", stroke:"none"}}
             d="m 0,0 0,-47.491 c 0,-3.125 -2.75,-7.25 -7.25,-7.25 -4.5,0 -9.094,1.625 -9.094,1.625 l 0,-12.75 c 0,0 6.719,-1.25 10.719,-1.25 0,0 20.75,-2.375 20.75,18.25 L 15.125,0 0,0 Z" /></g><g
           transform="translate(136.75,551)"
           id="g28"><path
             id="path30"
             style={{ fill: "#84bf4d", fillOpacity: 1, fillRule: "nonzero", stroke: "none" }}
             d="M 0,0 14.125,0 7,23.25 0,0 Z m 17.875,39.991 20.375,-65.741 -16.5,0 -4.375,13.875 -21,-0.25 -4.25,-13.625 -13.25,0 20.875,65.741 18.125,0 z" /></g><g
           transform="translate(190.5,525.25)"
           id="g32"><path
             id="path34"
             style={{ fill: "#84bf4d", fillOpacity: 1, fillRule: "nonzero", stroke: "none" }}
             d="m 0,0 -14.5,0 20.25,34.875 -18.375,30.866 18.375,0 10.5,-20.116 11.125,20.116 14.375,0 -18,-30.616 L 43.875,0 25.5,0 13,24 0,0 Z" /></g><g
           transform="translate(272.8422,556.1302)"
           id="g36"><path
             id="path38"
             style={{fill:"#ffffff", fillOpacity:1, fillRule:"evenodd", stroke:"none"}}
             d="m 0,0 c 0,0.707 -0.372,1.357 -0.982,1.707 l -16.264,9.36 c -0.275,0.162 -0.583,0.246 -0.895,0.258 l -0.169,0 c -0.31,-0.012 -0.619,-0.096 -0.898,-0.258 l -16.264,-9.36 c -0.606,-0.35 -0.983,-1 -0.983,-1.707 l 0.036,-25.203 c 0,-0.351 0.182,-0.677 0.49,-0.849 0.302,-0.181 0.675,-0.181 0.976,0 l 9.665,5.535 c 0.612,0.363 0.984,1.004 0.984,1.704 l 0,11.775 c 0,0.702 0.372,1.352 0.981,1.701 l 4.115,2.37 c 0.307,0.177 0.642,0.264 0.985,0.264 0.335,0 0.679,-0.087 0.977,-0.264 l 4.114,-2.37 c 0.609,-0.349 0.982,-0.999 0.982,-1.701 l 0,-11.775 c 0,-0.7 0.378,-1.345 0.985,-1.704 l 9.663,-5.535 c 0.303,-0.181 0.682,-0.181 0.982,0 0.3,0.172 0.488,0.498 0.488,0.849 L 0,0 Z" /></g><g
           transform="translate(358.1781,543.0069)"
           id="g40"><path
             id="path42"
             style={{ fill: "#ffffff", fillOpacity: 1, fillRule: "evenodd", stroke: "none" }}
             d="m 0,0 c 0,-0.175 -0.094,-0.338 -0.246,-0.425 l -5.586,-3.22 c -0.152,-0.087 -0.339,-0.087 -0.49,0 l -5.587,3.22 c -0.152,0.087 -0.246,0.25 -0.246,0.425 l 0,6.451 c 0,0.175 0.094,0.337 0.246,0.425 l 5.586,3.227 c 0.152,0.087 0.339,0.087 0.492,0 L -0.245,6.876 C -0.094,6.788 0,6.626 0,6.451 L 0,0 Z M 1.51,47.77 C 1.205,47.939 0.834,47.935 0.533,47.759 0.233,47.582 0.048,47.26 0.048,46.912 l 0,-24.96 c 0,-0.245 -0.131,-0.472 -0.343,-0.595 -0.213,-0.123 -0.475,-0.123 -0.688,0 l -4.073,2.347 c -0.608,0.35 -1.356,0.349 -1.963,-0.001 l -16.271,-9.39 c -0.608,-0.351 -0.982,-0.999 -0.982,-1.701 l 0,-18.784 c 0,-0.701 0.374,-1.35 0.982,-1.701 l 16.269,-9.397 c 0.609,-0.351 1.358,-0.351 1.966,0 l 16.272,9.397 c 0.608,0.351 0.982,1 0.982,1.701 l 0,46.823 c 0,0.712 -0.385,1.369 -1.007,1.716 L 1.51,47.77 Z" /></g><g
           transform="translate(417.8972,549.6262)"
           id="g44"><path
             id="path46"
             style={{ fill: "#ffffff", fillOpacity: 1, fillRule: "evenodd", stroke: "none" }}
             d="m 0,0 c 0.605,0.352 0.978,0.999 0.978,1.699 l 0,4.552 c 0,0.7 -0.373,1.347 -0.979,1.699 l -16.165,9.386 c -0.609,0.353 -1.36,0.354 -1.969,0.002 L -34.4,7.949 c -0.607,-0.351 -0.982,-1 -0.982,-1.702 l 0,-18.778 c 0,-0.706 0.379,-1.358 0.993,-1.707 l 16.163,-9.21 c 0.596,-0.34 1.326,-0.344 1.926,-0.011 l 9.777,5.434 c 0.31,0.173 0.503,0.498 0.505,0.852 0.002,0.354 -0.186,0.682 -0.493,0.859 l -16.368,9.394 c -0.305,0.175 -0.493,0.501 -0.493,0.852 l 0,5.885 c 0,0.351 0.187,0.676 0.491,0.851 l 5.094,2.937 c 0.303,0.175 0.678,0.175 0.981,0 l 5.097,-2.937 c 0.304,-0.175 0.491,-0.5 0.491,-0.851 l 0,-4.63 c 0,-0.352 0.188,-0.676 0.493,-0.852 0.304,-0.175 0.679,-0.174 0.983,0.002 L 0,0 Z" /></g><g
           transform="translate(302.4276,567.0634)"
           id="g48"><path
             id="path50"
             style={{fill:"#84bf4d", fillOpacity:1, fillRule:"evenodd", stroke:"none"}}
             d="m 0,0 c 0.608,0.351 1.357,0.351 1.964,0 l 16.269,-9.388 c 0.608,-0.351 0.982,-0.999 0.982,-1.702 l 0,-18.79 c 0,-0.702 -0.374,-1.351 -0.982,-1.702 L 1.965,-40.978 c -0.608,-0.351 -1.357,-0.351 -1.966,0 l -16.264,9.396 c -0.608,0.351 -0.982,1 -0.982,1.702 l 0,18.791 c 0,0.702 0.374,1.35 0.982,1.701 L 0,0 Z" /></g><g
           transform="translate(400.5066,550.5057)"
           id="g52"><path
             id="path54"
             style={{ fill: "#84bf4d", fillOpacity: 1, fillRule: "evenodd", stroke: "none" }}
             d="m 0,0 c 0.117,0.068 0.26,0.068 0.377,0 l 3.122,-1.801 c 0.117,-0.068 0.189,-0.192 0.189,-0.327 l 0,-3.605 c 0,-0.135 -0.072,-0.259 -0.189,-0.326 L 0.377,-7.861 C 0.26,-7.928 0.117,-7.928 0,-7.861 l -3.12,1.802 c -0.116,0.067 -0.188,0.191 -0.188,0.326 l 0,3.605 c 0,0.135 0.072,0.259 0.188,0.327 L 0,0 Z" /></g></g></g></g></svg>
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
                  {/* <Logo /> */}
                </a>
                <nav className="flex gap-1 flex-col md:flex-row">
                  <ActiveLink href="/">🏴‍☠️ Chat</ActiveLink>
                  <ActiveLink href="/avwx">🏴‍☠️ AVWX Chat</ActiveLink>
                  {/* <ActiveLink href="/structured_output">
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
                  <ActiveLink href="/langgraph">🕸️ LangGraph</ActiveLink> */}
                </nav>
              </div>

              <div className="flex justify-center">
                <Button asChild variant="outline" size="default">
                  <a
                    href="https://github.com/langchain-ai/langchain-nextjs-template"
                    target="_blank"
                  >
                   
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
