# 🦜️🔗 LangChain + Next.js Starter Template

This template scaffolds a simple LangChain.js + Next.js starter template. It has one endpoint, `POST /api/chat`, that streams a LangChain model call,
then uses Vercel's [AI SDK](https://github.com/vercel-labs/ai) to pipe that stream back to the client and display the incoming messages.

![Screenshot of the title card](/public/images/title-card.png)

## Getting Started

First, you'll need to set up an `.env.local` file. Copy the `.env.local.example` to `.env.local`, and add your OpenAI API key.

Next, install the required packages using your preferred package manager (e.g. `yarn`).

Now you're ready to run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result! Ask the bot something and you'll see a streamed response:

![A streaming conversation between the user and the AI](/public/images/conversation.png)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Backend logic lives in `app/api/chat/route.ts`. From here, you can change the prompt and model, or add other modules and logic.

## Learn More

The example chain in the `route.ts` file uses [LangChain Expression Language](https://js.langchain.com/docs/guides/expression_language/interface) to
compose different LangChain modules together. You can integrate other retrievers, agents, preconfigured chains, and more too, though keep in mind
`BytesOutputParser` is meant to be used directly with model output.

To learn more about what you can do with LangChain.js, check out the docs here:

- https://js.langchain.com/docs/

## Deploy on Vercel

When ready, you can deploy your app on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
