import { GoogleGenAI } from '@google/genai'
import { QdrantClient } from '@qdrant/js-client-rest'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
const COLLECTION_NAME = 'cv_chunks_gemini'

// Must match the dimension used when storing CV vectors
const EMBED_DIM = 768

function getQdrantClient() {
  return new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    ...(process.env.QDRANT_API_KEY ? { apiKey: process.env.QDRANT_API_KEY } : {}),
    checkCompatibility: false,
  })
}

export type CVChunk = {
  section: string
  content: string
  score?: number
}

export async function embedText(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: { outputDimensionality: EMBED_DIM },
  })
  return response.embeddings![0].values!
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(t => embedText(t)))
}

export async function retrieveCV(
  userId: string,
  query: string,
  topK: number = 5
): Promise<CVChunk[]> {
  try {
    const qdrant = getQdrantClient()
    const queryVector = await embedText(query)

    const results = await qdrant.search(COLLECTION_NAME, {
      vector: queryVector,
      limit: topK,
      filter: {
        must: [{ key: 'user_id', match: { value: userId } }],
      },
      with_payload: true,
    })

    return results.map(r => ({
      section: (r.payload?.section as string) || 'general',
      content: (r.payload?.content as string) || '',
      score: r.score,
    }))
  } catch (err) {
    console.error('[RAG] retrieveCV failed:', err)
    return []
  }
}

export function buildCVContext(chunks: CVChunk[]): string {
  if (chunks.length === 0) {
    return 'No CV uploaded yet. Answer based on general knowledge but note you cannot personalise without the CV.'
  }
  return chunks
    .map(c => `[${c.section.toUpperCase()}]\n${c.content}`)
    .join('\n\n---\n\n')
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return 0
  const dot  = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
  const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0))
  const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0))
  if (magA === 0 || magB === 0) return 0
  return dot / (magA * magB)
}