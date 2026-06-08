import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// Chat model
export const chatModel = genAI.models

// Embedding model
export async function embedText(text: string): Promise<number[]> {
  const result = await genAI.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
  })
  return result.embeddings?.[0]?.values ?? []
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(t => embedText(t)))
}