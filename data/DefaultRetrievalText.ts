export default `# Trigonometry (from Ancient Greek τρίγωνον (trígōnon) 'triangle', and μέτρον (métron) 'measure')[1] is a branch of mathematics concerned with relationships between angles and ratios of lengths. The field emerged in the Hellenistic world during the 3rd century BC from applications of geometry to astronomical studies.[2] The Greeks focused on the calculation of chords, while mathematicians in India created the earliest-known tables of values for trigonometric ratios (also called trigonometric functions) such as sine.[3]

Throughout history, trigonometry has been applied in areas such as geodesy, surveying, celestial mechanics, and navigation.[4]

Trigonometry is known for its many identities. These trigonometric identities[5][6] are commonly used for rewriting trigonometrical expressions with the aim to simplify an expression, to find a more useful form of an expression, or to solve an equation.[7]

History
Main article: History of trigonometry

Hipparchus, credited with compiling the first trigonometric table, has been described as "the father of trigonometry".[8]
Sumerian astronomers studied angle measure, using a division of circles into 360 degrees.[9] They, and later the Babylonians, studied the ratios of the sides of similar triangles and discovered some properties of these ratios but did not turn that into a systematic method for finding sides and angles of triangles. The ancient Nubians used a similar method.[10]

In the 3rd century BC, Hellenistic mathematicians such as Euclid and Archimedes studied the properties of chords and inscribed angles in circles, and they proved theorems that are equivalent to modern trigonometric formulae, although they presented them geometrically rather than algebraically. In 140 BC, Hipparchus (from Nicaea, Asia Minor) gave the first tables of chords, analogous to modern tables of sine values, and used them to solve problems in trigonometry and spherical trigonometry.[11] In the 2nd century AD, the Greco-Egyptian astronomer Ptolemy (from Alexandria, Egypt) constructed detailed trigonometric tables (Ptolemy's table of chords) in Book 1, chapter 11 of his Almagest.[12] Ptolemy used chord length to define his trigonometric functions, a minor difference from the sine convention we use today.[13] (The value we call sin(θ) can be found by looking up the chord length for twice the angle of interest (2θ) in Ptolemy's table, and then dividing that value by two.) Centuries passed before more detailed tables were produced, and Ptolemy's treatise remained in use for performing trigonometric calculations in astronomy throughout the next 1200 years in the medieval Byzantine, Islamic, and, later, Western European worlds.

The modern definition of the sine is first attested in the Surya Siddhanta, and its properties were further documented in the 5th century (AD) by Indian mathematician and astronomer Aryabhata.[14] These Greek and Indian works were translated and expanded by medieval Islamic mathematicians. In 830 AD, Persian mathematician Habash al-Hasib al-Marwazi produced the first table of cotangents.[15][16] By the 10th century AD, in the work of Persian mathematician Abū al-Wafā' al-Būzjānī, all six trigonometric functions were used.[17] Abu al-Wafa had sine tables in 0.25° increments, to 8 decimal places of accuracy, and accurate tables of tangent values.[17] He also made important innovations in spherical trigonometry[18][19][20] The Persian polymath Nasir al-Din al-Tusi has been described as the creator of trigonometry as a mathematical discipline in its own right.[21][22][23] He was the first to treat trigonometry as a mathematical discipline independent from astronomy, and he developed spherical trigonometry into its present form.[16] He listed the six distinct cases of a right-angled triangle in spherical trigonometry, and in his On the Sector Figure, he stated the law of sines for plane and spherical triangles, discovered the law of tangents for spherical triangles, and provided proofs for both these laws.[24] Knowledge of trigonometric functions and methods reached Western Europe via Latin translations of Ptolemy's Greek Almagest as well as the works of Persian and Arab astronomers such as Al Battani and Nasir al-Din al-Tusi.[25] One of the earliest works on trigonometry by a northern European mathematician is De Triangulis by the 15th century German mathematician Regiomontanus, who was encouraged to write, and provided with a copy of the Almagest, by the Byzantine Greek scholar cardinal Basilios Bessarion with whom he lived for several years.[26] At the same time, another translation of the Almagest from Greek into Latin was completed by the Cretan George of Trebizond.[27] Trigonometry was still so little known in 16th-century northern Europe that Nicolaus Copernicus devoted two chapters of De revolutionibus orbium coelestium to explain its basic concepts.

Driven by the demands of navigation and the growing need for accurate maps of large geographic areas, trigonometry grew into a major branch of mathematics.[28] Bartholomaeus Pitiscus was the first to use the word, publishing his Trigonometria in 1595.[29] Gemma Frisius described for the first time the method of triangulation still used today in surveying. It was Leonhard Euler who fully incorporated complex numbers into trigonometry. The works of the Scottish mathematicians James Gregory in the 17th century and Colin Maclaurin in the 18th century were influential in the development of trigonometric series.[30] Also in the 18th century, Brook Taylor defined the general Taylor series.[31]


\`\`\`



We can recreate the agent executor directly with the \`initializeAgentExecutorWithOptions\` method.
This allows us to customize the agent's system message by passing in a \`prefix\` into \`agentArgs\`.
Importantly, we must pass in \`return_intermediate_steps: true\` since we are recording that with our memory object.

\`\`\`typescript
import { initializeAgentExecutorWithOptions } from "langchain/agents";

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: "openai-functions",
  memory,
  returnIntermediateSteps: true,
  agentArgs: {
    prefix:
      prefix ??
      \`Do your best to answer the questions. Feel free to use any tools available to look up relevant information, only if necessary.\`,
  },
});
\`\`\`
`;