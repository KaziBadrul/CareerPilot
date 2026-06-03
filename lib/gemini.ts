import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Chat model
export const chatModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// Embedding model
export async function embedText(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
  const result = await model.embedContent(text)
  return result.embedding.values
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(t => embedText(t)))
}