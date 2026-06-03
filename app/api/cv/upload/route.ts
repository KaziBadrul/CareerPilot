import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
// import { OpenAIEmbeddings } from '@langchain/openai'
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers"
import { QdrantClient } from '@qdrant/js-client-rest'
import pdf from 'pdf-parse-fork' // Cleaned up parser completely safe for Turbopack
import mammoth from 'mammoth'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
)

const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
});

// Added checkCompatibility config to silence server compatibility logs
const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false
})

const COLLECTION = 'cv_chunks_local'

async function ensureCollection() {
    const collections = await qdrant.getCollections()
    const exists = collections.collections.some(c => c.name === COLLECTION)
    if (!exists) {
        await qdrant.createCollection(COLLECTION, {
            vectors: { size: 384, distance: 'Cosine' }
        })
    }

    try {
        await qdrant.createPayloadIndex(COLLECTION, {
            field_name: 'user_id',
            field_schema: 'keyword',
            wait: true
        })
    } catch (indexErr) {
        console.error("Failed to create payload index for user_id:", indexErr)
    }
}

function chunkCV(text: string): { section: string; content: string }[] {
    const sectionPatterns = [
        /\b(education|academic)\b/i,
        /\b(experience|work history|employment)\b/i,
        /\b(skills|technical skills|competencies)\b/i,
        /\b(projects|portfolio)\b/i,
        /\b(certifications|awards)\b/i,
        /\b(summary|objective|profile)\b/i,
    ]

    const lines = text.split('\n')
    const chunks: { section: string; content: string }[] = []
    let currentSection = 'general'
    let currentContent: string[] = []

    for (const line of lines) {
        const matchedSection = sectionPatterns.find(p => p.test(line))
        if (matchedSection && line.length < 60) {
            if (currentContent.length > 0) {
                chunks.push({ section: currentSection, content: currentContent.join('\n').trim() })
            }
            currentSection = line.trim().toLowerCase()
            currentContent = []
        } else {
            currentContent.push(line)
        }
    }
    if (currentContent.length > 0) {
        chunks.push({ section: currentSection, content: currentContent.join('\n').trim() })
    }

    const finalChunks: { section: string; content: string }[] = []
    for (const chunk of chunks) {
        const words = chunk.content.split(' ')
        for (let i = 0; i < words.length; i += 300) {
            finalChunks.push({
                section: chunk.section,
                content: words.slice(i, i + 300).join(' ')
            })
        }
    }
    return finalChunks.filter(c => c.content.length > 50)
}

export async function POST(req: NextRequest) {
    let createdCvDocId: string | null = null
    let uploadedStoragePath: string | null = null

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const userId = formData.get('userId') as string

        if (!file || !userId) {
            return NextResponse.json({ error: "Missing required form fields" }, { status: 400 })
        }

        // Extract binary data
        const buffer = Buffer.from(await file.arrayBuffer())
        let rawText = ''

        if (file.name.endsWith('.pdf')) {
            try {
                // pdf-parse-fork reads the standard node buffer right away without crashing
                const parsed = await pdf(buffer)
                rawText = parsed.text
            } catch (pdfError) {
                console.error("PDF Parsing failed:", pdfError)
                return NextResponse.json({ error: "Failed to parse PDF document" }, { status: 500 })
            }
        } else if (file.name.endsWith('.docx')) {
            const result = await mammoth.extractRawText({ buffer })
            rawText = result.value
        }

        // Upload file to Supabase Storage
        const storagePath = `cvs/${userId}/${file.name}`
        uploadedStoragePath = storagePath
        await supabase.storage.from('documents').upload(storagePath, buffer, {
            upsert: true
        })

        // Ensure user exists in public.users table (acts as automatic sync if DB triggers aren't configured)
        try {
            const { data: userExists } = await supabase
                .from('users')
                .select('id')
                .eq('id', userId)
                .maybeSingle()

            if (!userExists) {
                let email = ''
                try {
                    const { data: authUser } = await supabase.auth.admin.getUserById(userId)
                    if (authUser?.user) {
                        email = authUser.user.email || ''
                    }
                } catch (authErr) {
                    console.error("Failed to fetch user details from auth admin API:", authErr)
                }

                const { error: insertUserError } = await supabase
                    .from('users')
                    .insert({ id: userId, email })

                if (insertUserError) {
                    console.error("Failed to auto-provision user in public.users:", insertUserError)
                }
            }
        } catch (provisionErr) {
            console.error("User provisioning check failed:", provisionErr)
        }

        // Save to DB
        const { data: cvDoc, error: dbError } = await supabase
            .from('cv_documents')
            .upsert({ user_id: userId, filename: file.name, raw_text: rawText, storage_path: storagePath })
            .select().single()

        if (dbError || !cvDoc) {
            console.error("Database upsert failed:", dbError)
            return NextResponse.json({ error: "Database registration failed" }, { status: 500 })
        }
        createdCvDocId = cvDoc.id

        // Chunk and embed text data
        await ensureCollection()
        const chunks = chunkCV(rawText)

        // Delete old vectors for this specific user path
        await qdrant.delete(COLLECTION, {
            filter: { must: [{ key: 'user_id', match: { value: userId } }] }
        })

        // Embed and upsert items in batches of 20
        const batchSize = 20
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize)
            const vectors = await embeddings.embedDocuments(batch.map(c => c.content))

            const points = batch.map((chunk, j) => ({
                // Using uuidv4 guarantees string-format unique IDs for Qdrant storage entries
                id: uuidv4(),
                vector: vectors[j],
                payload: {
                    user_id: userId,
                    cv_id: cvDoc.id,
                    section: chunk.section,
                    content: chunk.content
                }
            }))

            await qdrant.upsert(COLLECTION, { points })
        }

        return NextResponse.json({ success: true, chunks: chunks.length })

    } catch (globalError) {
        console.error("Global Route Handler failure:", globalError)

        // Clean up created DB and Storage entries in case of failures during vector ingestion
        try {
            if (createdCvDocId) {
                await supabase.from('cv_documents').delete().eq('id', createdCvDocId)
            }
            if (uploadedStoragePath) {
                await supabase.storage.from('documents').remove([uploadedStoragePath])
            }
        } catch (cleanupError) {
            console.error("Failed to clean up records after global failure:", cleanupError)
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}