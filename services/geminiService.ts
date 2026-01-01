
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini client using the environment variable
export const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error("Missing or invalid API key. Please set a valid GEMINI_API_KEY in .env.local");
  }
  return new GoogleGenAI({ apiKey });
};

export const translateText = async (text: string, sourceLang: string, targetLang: string = "English") => {
  if (!text.trim()) return "";
  try {
    const response = await fetch('/api/ai/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang })
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return data.text || "Could not translate.";
  } catch (error) {
    console.error("Translation error:", error);
    return "Error connecting to AI service.";
  }
};

export const researchGrammarUsage = async (topic: string, language: string) => {
  try {
    const response = await fetch('/api/ai/grammar-research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, language })
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return {
      text: data.text || "No explanation found.",
      sources: data.sources || []
    };
  } catch (error) {
    console.error("Grammar research error:", error);
    return { text: "Research failed.", sources: [] };
  }
};

export const visualizeCulture = async (prompt: string) => {
  try {
    const response = await fetch('/api/ai/visualize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return data.image_url || null;
  } catch (error) {
    console.error("Image generation error:", error);
  }
  return null;
};

export const generateReadingPassage = async (language: string, level: string = "B1") => {
  try {
    const response = await fetch('/api/ai/reading-passage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, level })
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    // Parse the inner text which is expected to be JSON string
    try {
        const parsed = JSON.parse(data.text);
        return parsed;
    } catch (e) {
        // In case the backend returns object directly (if Flask jsonify handles it, but here we return .text from Gemini which is string)
        // Gemini .text usually is a string. If we requested JSON, it's a JSON string.
        return data.text ? JSON.parse(data.text) : null;
    }
  } catch (error) {
    console.error("Reading generation error:", error);
    return null;
  }
};

// Keep helpers for legacy/client-side only if strictly needed, but prefer backend.
// Note: getGeminiClient is still used by AIConversation for streaming.
// We will leave getGeminiClient for AIConversation but ensure other services use backend.

// Additional helper for ListeningHub
export const generateScenario = async (language: string, level: string, theme: string) => {
    try {
        const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: `Generate a natural dialogue or scene in ${language} at ${level} level (about 4 sentences). Theme: ${theme}. Return only text.`
            })
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Scenario generation error:", error);
        throw error;
    }
};

export const generateWritingPrompt = async (language: string, topic: string = "General") => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a writing prompt in ${language} about "${topic}" for an intermediate learner. Include 5 keywords to use. Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING },
            suggestedWords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["prompt", "suggestedWords"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Writing prompt error:", error);
    return { prompt: "Write about your day.", suggestedWords: [] };
  }
};

export const analyzeWriting = async (text: string, language: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this ${language} text for an intermediate learner: "${text}". Provide a score (0-100), feedback, and a list of specific corrections. Format as JSON.`,
      config: {
        thinkingConfig: { thinkingBudget: 5000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            corrections: { type: Type.ARRAY, items: { type: Type.STRING } },
            feedback: { type: Type.STRING },
            score: { type: Type.INTEGER }
          },
          required: ["corrections", "feedback", "score"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Analysis error:", error);
    return { corrections: [], feedback: "Analysis unavailable.", score: 0 };
  }
};

export const generateGrammarExplanation = async (topic: string, language: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain ${topic} in ${language} for an intermediate student. Provide 3 example sentences. Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            explanation: { type: Type.STRING },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["topic", "explanation", "examples"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Grammar generation error:", error);
    return { topic, explanation: "Could not generate lesson.", examples: [] };
  }
};

export const generateWorkout = async (language: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a 3-part workout for ${language} (B1 level). 1: Translation sentence, 2: Cloze sentence, 3: Short essay prompt. Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translationTask: { type: Type.STRING },
            clozeTask: { type: Type.STRING },
            compositionPrompt: { type: Type.STRING }
          },
          required: ["translationTask", "clozeTask", "compositionPrompt"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Workout generation error:", error);
    return null;
  }
};

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const decode = decodeBase64;
export const encode = encodeBase64;

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
