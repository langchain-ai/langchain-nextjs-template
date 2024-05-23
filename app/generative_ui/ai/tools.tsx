import { z } from "zod";

export async function images(input: { query: string }) {
  type UrlParameters = Record<
    string,
    string | number | boolean | undefined | null
  >;

  function buildUrl<P extends UrlParameters>(
    path: string,
    parameters: P,
    baseUrl: string,
  ): string {
    const nonUndefinedParams: [string, string][] = Object.entries(parameters)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, `${value}`]);
    const searchParams = new URLSearchParams(nonUndefinedParams);
    return `${baseUrl}/${path}?${searchParams}`;
  }

  const baseUrl = "https://serpapi.com";
  const response = await fetch(
    buildUrl(
      "search",
      {
        api_key: process.env.SERPAPI_API_KEY,
        q: input.query,
        engine: "google_images",
      },
      baseUrl,
    ),
  );

  const res = await response.json();

  if (res.error) {
    throw new Error(`Got error from serpAPI: ${res.error}`);
  }

  return z
    .object({
      images_results: z.array(
        z.object({
          original: z.string(),
          thumbnail: z.string(),
        }),
      ),
    })
    .parse(res);
}

// copied from the implementation of SerpAPI tool
// in @langchain/community
export async function search(input: { query: string }) {
  type UrlParameters = Record<
    string,
    string | number | boolean | undefined | null
  >;

  function buildUrl<P extends UrlParameters>(
    path: string,
    parameters: P,
    baseUrl: string,
  ): string {
    const nonUndefinedParams: [string, string][] = Object.entries(parameters)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, `${value}`]);
    const searchParams = new URLSearchParams(nonUndefinedParams);
    return `${baseUrl}/${path}?${searchParams}`;
  }

  const baseUrl = "https://serpapi.com";
  const response = await fetch(
    buildUrl(
      "search",
      { api_key: process.env.SERPAPI_API_KEY, q: input.query },
      baseUrl,
    ),
  );

  const res = await response.json();

  if (res.error) {
    throw new Error(`Got error from serpAPI: ${res.error}`);
  }

  const answer_box = res.answer_box_list
    ? res.answer_box_list[0]
    : res.answer_box;
  if (answer_box) {
    if (answer_box.result) {
      return answer_box.result;
    } else if (answer_box.answer) {
      return answer_box.answer;
    } else if (answer_box.snippet) {
      return answer_box.snippet;
    } else if (answer_box.snippet_highlighted_words) {
      return answer_box.snippet_highlighted_words.toString();
    } else {
      const answer: { [key: string]: string } = {};
      Object.keys(answer_box)
        .filter(
          (k) =>
            !Array.isArray(answer_box[k]) &&
            typeof answer_box[k] !== "object" &&
            !(
              typeof answer_box[k] === "string" &&
              answer_box[k].startsWith("http")
            ),
        )
        .forEach((k) => {
          answer[k] = answer_box[k];
        });
      return JSON.stringify(answer);
    }
  }

  if (res.events_results) {
    return JSON.stringify(res.events_results);
  }

  if (res.sports_results) {
    return JSON.stringify(res.sports_results);
  }

  if (res.top_stories) {
    return JSON.stringify(res.top_stories);
  }

  if (res.news_results) {
    return JSON.stringify(res.news_results);
  }

  if (res.jobs_results?.jobs) {
    return JSON.stringify(res.jobs_results.jobs);
  }

  if (res.questions_and_answers) {
    return JSON.stringify(res.questions_and_answers);
  }

  if (res.popular_destinations?.destinations) {
    return JSON.stringify(res.popular_destinations.destinations);
  }

  if (res.top_sights?.sights) {
    const sights: Array<{ [key: string]: string }> = res.top_sights.sights
      .map((s: { [key: string]: string }) => ({
        title: s.title,
        description: s.description,
        price: s.price,
      }))
      .slice(0, 8);
    return JSON.stringify(sights);
  }

  if (res.shopping_results && res.shopping_results[0]?.title) {
    return JSON.stringify(res.shopping_results.slice(0, 3));
  }

  if (res.images_results && res.images_results[0]?.thumbnail) {
    return res.images_results
      .map((ir: { thumbnail: string }) => ir.thumbnail)
      .slice(0, 10)
      .toString();
  }

  const snippets: any[] = [];
  if (res.knowledge_graph) {
    if (res.knowledge_graph.description) {
      snippets.push(res.knowledge_graph.description);
    }

    const title = res.knowledge_graph.title || "";
    Object.keys(res.knowledge_graph)
      .filter(
        (k) =>
          typeof res.knowledge_graph[k] === "string" &&
          k !== "title" &&
          k !== "description" &&
          !k.endsWith("_stick") &&
          !k.endsWith("_link") &&
          !k.startsWith("http"),
      )
      .forEach((k) =>
        snippets.push(`${title} ${k}: ${res.knowledge_graph[k]}`),
      );
  }

  const first_organic_result = res.organic_results?.[0];
  if (first_organic_result) {
    if (first_organic_result.snippet) {
      snippets.push(first_organic_result.snippet);
    } else if (first_organic_result.snippet_highlighted_words) {
      snippets.push(first_organic_result.snippet_highlighted_words);
    } else if (first_organic_result.rich_snippet) {
      snippets.push(first_organic_result.rich_snippet);
    } else if (first_organic_result.rich_snippet_table) {
      snippets.push(first_organic_result.rich_snippet_table);
    } else if (first_organic_result.link) {
      snippets.push(first_organic_result.link);
    }
  }

  if (res.buying_guide) {
    snippets.push(res.buying_guide);
  }

  if (res.local_results?.places) {
    snippets.push(res.local_results.places);
  }

  if (snippets.length > 0) {
    return JSON.stringify(snippets);
  } else {
    return "No good search result found";
  }
}
