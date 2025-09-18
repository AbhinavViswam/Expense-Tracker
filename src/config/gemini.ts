import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

export async function getGeminiResponse(
  prompt: string,
  user?: any
): Promise<string> {
  const systemInstruction = `
    You are Expense Trackers's AI assistant. You are a financial support and management expert. You know to manage money very well. 
      Always be polite and concise. 
      The current user details:
      ${user}
      Tailor responses to this user.
    `;
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("Failed to fetch response from Gemini");
  }
}
