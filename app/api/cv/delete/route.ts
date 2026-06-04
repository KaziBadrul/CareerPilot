import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { QdrantClient } from '@qdrant/js-client-rest'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
)

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false
})

const COLLECTION = 'cv_chunks_gemini'

export async function DELETE(req: NextRequest) {
    try {
        const { documentId, userId } = await req.json()

        if (!documentId || !userId) {
            return NextResponse.json({ error: 'Missing documentId or userId' }, { status: 400 })
        }

        // 1. Fetch the document record to get storage_path and verify ownership
        const { data: doc, error: fetchError } = await supabase
            .from('cv_documents')
            .select('id, storage_path, user_id')
            .eq('id', documentId)
            .eq('user_id', userId)
            .single()

        if (fetchError || !doc) {
            return NextResponse.json({ error: 'Document not found or access denied' }, { status: 404 })
        }

        // 2. Delete vectors from Qdrant (filter by cv_id)
        try {
            await qdrant.delete(COLLECTION, {
                filter: { must: [{ key: 'cv_id', match: { value: documentId } }] }
            })
        } catch (qdrantErr) {
            // Log but don't block — Qdrant may not have entries for this doc
            console.error('[Delete] Qdrant delete error:', qdrantErr)
        }

        // 3. Delete file from Supabase Storage
        if (doc.storage_path) {
            const { error: storageError } = await supabase.storage
                .from('documents')
                .remove([doc.storage_path])

            if (storageError) {
                console.error('[Delete] Storage remove error:', storageError)
            }
        }

        // 4. Delete the DB record
        const { error: dbError } = await supabase
            .from('cv_documents')
            .delete()
            .eq('id', documentId)
            .eq('user_id', userId)

        if (dbError) {
            return NextResponse.json({ error: 'Failed to delete document record' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[Delete CV] Unexpected error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
