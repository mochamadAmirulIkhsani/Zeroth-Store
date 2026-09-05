// Vercel serverless entry — folder `api/` otomatis jadi function `api`
// (route /api/(.*) → /api di vercel.json). Re-exports the Express app.
export { default } from '../server.mjs';