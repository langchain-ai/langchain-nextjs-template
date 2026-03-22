# GEMINI.md

This file provides instructional context and project overview for the LangChain + Next.js Starter Template.

## Project Overview

This is a comprehensive starter template for building AI-powered applications using **LangChain.js**, **Next.js (App Router)**, and the **Vercel AI SDK**. It demonstrates several core LLM patterns and use cases, all optimized for serverless Edge functions.

### Main Technologies
- **Framework:** Next.js 15+ (App Router)
- **AI Orchestration:** LangChain.js & LangGraph.js
- **Streaming:** Vercel AI SDK (`ai` package)
- **Database:** Supabase (for Vector Storage/RAG)
- **Validation:** Zod
- **Styling:** Tailwind CSS & Radix UI

### Architecture
- `app/api/chat/`: Contains API routes for various chat modes:
    - `route.ts`: Simple chat chain.
    - `structured_output/route.ts`: Schema-driven LLM output.
    - `agents/route.ts`: Tool-calling ReAct agent using LangGraph.
    - `retrieval/route.ts`: RAG implementation with chat history.
    - `retrieval_agents/route.ts`: Agentic RAG implementation.
- `app/langgraph/`: Contains custom LangGraph agent definitions and state management.
- `app/api/retrieval/ingest/`: API route for splitting and embedding documents into Supabase.
- `components/`: UI components for chat, file uploads, and intermediate step visualization.

## Building and Running

### Prerequisites
- Node.js >= 18
- Yarn (v3.5.1 configured via `.yarnrc.yml`)

### Environment Variables
Copy `.env.example` to `.env.local` and provide the following:
- `OPENAI_API_KEY`: Required for most examples.
- `SERPAPI_API_KEY`: Required for the Agent example (Search tool).
- `SUPABASE_URL` & `SUPABASE_PRIVATE_KEY`: Required for Retrieval/RAG examples.
- `LANGCHAIN_CALLBACKS_BACKGROUND`: Must be `false` for Edge functions to ensure tracing finishes.

### Key Commands
- `yarn dev`: Starts the development server at `http://localhost:3000`.
- `yarn build`: Builds the application for production.
- `yarn start`: Starts the production server.
- `yarn lint`: Runs ESLint for code quality checks.
- `yarn format`: Runs Prettier to format code in the `app` directory.
- `ANALYZE=true yarn build`: Builds and opens the Next.js Bundle Analyzer.

## Development Conventions

### Coding Style
- **TypeScript:** Use strict typing where possible.
- **LCEL (LangChain Expression Language):** Prefer LCEL for composing chains (e.g., `prompt.pipe(model).pipe(outputParser)`).
- **Streaming:** Use `StreamingTextResponse` from the Vercel AI SDK for all chat-related API routes.
- **Components:** UI components follow the Shadcn/UI pattern (Radix UI + Tailwind CSS).

### Testing & Validation
- **Schema Validation:** Use **Zod** for defining structured outputs and validating API requests.
- **Agentic Workflows:** Use **LangGraph.js** for any logic involving loops, state, or complex tool-calling patterns.
- **Vector Store:** The default vector store is **Supabase**. Ensure the `documents` table and `match_documents` RPC are set up according to LangChain documentation.

### Contribution Guidelines
- Backend logic should primarily reside in `app/api` routes or dedicated LangGraph files in `app/langgraph`.
- UI changes should be modularized in the `components/` directory.
- Always ensure `runtime = "edge"` is set for API routes that should run on the Edge.
