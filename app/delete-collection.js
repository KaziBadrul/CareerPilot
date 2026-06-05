require('dotenv').config({ path: '.env.local' })
const { QdrantClient } = require('@qdrant/js-client-rest')

const q = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false,
})

q.deleteCollection('cv_chunks_local')
  .then(() => console.log('DELETED — now re-upload your CV from the dashboard'))
  .catch(err => console.error('Failed:', err.message))