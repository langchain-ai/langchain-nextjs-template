async function listModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("--- GOOGLE GEMINI MODELS LIST ---");
    if (data.models) {
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log("- " + m.name.replace("models/", ""));
        }
      });
    } else {
      console.log("Error or No models:", JSON.stringify(data));
    }
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}
listModels();
