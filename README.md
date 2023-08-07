# 🦜️🔗 LangChain + Next.js Starter Template

This template scaffolds a simple LangChain.js + Next.js starter template. It has one endpoint, `POST /api/chat`, that streams back a model call to
the frontend. It uses Vercel's [AI SDK](https://github.com/vercel-labs/ai) to pipe the stream back to the client as well as display the incoming messages.

![Screenshot of the title card](/public/images/title.png?)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result! Ask the bot something and you'll see a streamed response:

![A streaming conversation between the user and the AI](/public/images/chat.png?)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Backend logic lives in `app/api/chat/route.ts`. From here, you can change the prompt and model, or add other modules and logic.

## Learn More

To learn more about what you can do with LangChain.js, check out the docs here:

- https://js.langchain.com/docs/

## Deploy on Vercel

When ready, you can deploy your app on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
