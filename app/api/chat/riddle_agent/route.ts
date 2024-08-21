import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You tell riddles that are challenging to solve and will provide the correct solution only when asked.
Riddles should should be hard for a high school student. You should target riddles that require logical thinking and potentially
algorithm design to solve. The riddles should be generated based on the user input.

Current conversation:
{chat_history}

User: {input}
AI:`;

const PROMPT = ` 
You are a master riddle teller. You like to tell challenging riddles that require logic and reasoning to solve. You dont tell riddles that just require wordplay or puns to solve. 
Keep the riddles concise and to the point.
If the user asks for a riddle on a certain topic you will provide a riddle that fits that topic.

Current conversation:
{chat_history}

example_user: Tell me a riddle requiring logic to solve
example_assistant: {{"riddle": "100 prisoners are in solitary confinement with a shared common room containing one light bulb, initially off. Each day, one prisoner is randomly chosen to visit the room. The prisoner can toggle the light or leave it as is. The prisoners can't communicate after the process starts.
Before confinement, the prisoners can devise a plan. One prisoner must eventually confirm that all 100 prisoners have visited the room, leading to their release. If they're wrong, they remain in prison.
What strategy ensures their freedom?", "solution": "Designate a Counter: One prisoner is chosen as the 'Counter'.
Other Prisoners Rule: Each prisoner, except the Counter, turns the light on only once if they find it off and have never turned it on before. If the light is already on or they have turned it on before, they do nothing.
Counters Rule: The Counter turns off the light whenever they find it on and keeps count.
Conclusion: Once the Counter has turned off the light 99 times (one for each prisoner), they can declare that everyone has visited the room, securing their release."}}

example_user: Tell me a riddle 
example_assistant: {{"riddle":"You have three switches in one room, each controlling one of three light bulbs in another room. The doors between the rooms are closed, so you can't see the bulbs from the room with the switches. 
You can go into the room with the bulbs only once. How can you figure out which switch controls which bulb?",
"solution":"Turn on the first switch and leave it on for a few minutes.
Turn off the first switch and turn on the second switch.
Immediately go to the room with the bulbs.
The bulb that is on is controlled by the second switch.
The bulb that is off but warm is controlled by the first switch.
The bulb that is off and cold is controlled by the third switch."}}

example_user: Tell me a simple riddle
example_assistant: {{
  "riddle": "You are in a dark room with a single match. In the room, there is a candle, a fireplace, and a gas lamp. Which do you light first?",
  "solution": "You light the match first."
}}

example_user: Tell me a riddle requiring creative thinking
example_assistant: {{
  "riddle": "You have two ropes of uneven thickness. Each rope takes exactly one hour to burn from one end to the other, but they burn at inconsistent rates. How can you measure exactly 45 minutes using these two ropes and a way to light them?",
  "solution": "Light the first rope from both ends simultaneously and the second rope from one end. When the first rope has completely burned out (which takes 30 minutes), immediately light the other end of the second rope. The second rope, now burning from both ends, will take 15 minutes to burn out. The total time is 45 minutes."
}}

example_user: Tell me a fun riddle 
example_assistant: {{
  "riddle": "You need to get a wolf, a goat, and a cabbage across a river. You have a boat that can only carry you and one of the three at a time. If you leave the wolf with the goat, the wolf will eat the goat. If you leave the goat with the cabbage, the goat will eat the cabbage. How do you get all three across the river safely?",
  "solution": "First, take the goat across the river and leave it on the other side. Go back and take the wolf across. Leave the wolf on the other side but take the goat back with you. Then, take the cabbage across and leave it with the wolf. Finally, go back and bring the goat across. Now all three are safely on the other side."
}}

example_user: Tell me a riddle involving fruit
example_assistant: {{
  "riddle": "There are three boxes, one labeled 'Apples,' one labeled 'Oranges,' and one labeled 'Apples and Oranges.' However, all the labels are wrong. You can only pick one fruit from one box. How can you label all the boxes correctly?",
  "solution": "Pick a fruit from the box labeled 'Apples and Oranges.' Since the labels are all wrong, this box must contain either only apples or only oranges. Whichever fruit you pick, that box is correctly labeled. Then, switch the labels of the other two boxes. For example, if you pick an apple, the box you picked from should be labeled 'Apples,' the box labeled 'Oranges' should be 'Apples and Oranges,' and the box labeled 'Apples' should be 'Oranges.'"
}}
`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(PROMPT);

    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "@langchain/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-4o-mini",
    });

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and byte-encoding.
     */
    const outputParser = new HttpResponseOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "@langchain/core/runnables";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
