# 🦜️🔗 LangChain + Next.js Starter Template

This template scaffolds a simple LangChain.js + Next.js starter template. It has one endpoint, `POST /api/chat`, that streams back a model call to
the frontend. It uses Vercel's [`ai` SDK](https://github.com/vercel-labs/ai) to pipe the stream back to the client as well as display the incoming messages.

![Screenshot of the interface](/public/images/example.png)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about what you can do with LangChain.js, check out the docs here:

- https://js.langchain.com/docs/

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
