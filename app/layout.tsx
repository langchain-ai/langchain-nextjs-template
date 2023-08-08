import "./globals.css";
import { Public_Sans } from "next/font/google";

import { Navbar } from "@/components/Navbar";

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
        <link rel="shortcut icon" href="/static/favicon.ico" />
      </head>
      <body className={publicSans.className}>
        <div className="flex flex-col m-24 h-[calc(100vh-12rem)]">
          <Navbar></Navbar>
          {children}
        </div>
      </body>
    </html>
  );
}
