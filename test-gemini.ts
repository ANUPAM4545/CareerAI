import { generateText } from "ai";
import { google } from "@ai-sdk/google";

async function main() {
  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: "Say hello",
    });
    console.log("Success with gemini-1.5-flash:", text);
  } catch (e) {
    console.error("Failed with gemini-1.5-flash:", e.message);
  }
}

main();
