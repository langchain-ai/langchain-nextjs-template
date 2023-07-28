import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
