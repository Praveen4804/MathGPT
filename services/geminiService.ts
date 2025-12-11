import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); 
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateSolutionImage = async (
  promptText: string,
  imageFile?: File
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  const prompt = `You are a math expert. Your task is to solve a math problem and present the solution as a single, clear, visually appealing image.
  
  Design Requirements:
  - Style: Minimalist, professional, high-contrast.
  - Color Scheme: Black and White (grayscale is okay for shading).
  - Background: White.
  - Text: Dark black/gray, clean legible font.
  
  Content:
  1. The original problem, clearly stated.
  2. A step-by-step breakdown of the solution.
  3. The final answer, boxed or highlighted.
  
  The entire explanation must be contained within this single image. Do not output any text response, only the image.
  
  The user's problem is: "${promptText}"`;

  try {
    const parts: any[] = [{ text: prompt }];
    if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        parts.push(imagePart);
    }

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: parts },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data; // Return base64 string
      }
    }

    throw new Error("No image was generated in the API response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to process your request: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the API.");
  }
};