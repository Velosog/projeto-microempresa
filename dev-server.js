/**
 * Local development server for /api/chat
 * Simulates Vercel's serverless function environment locally.
 *
 * Usage:
 *   node dev-server.js
 *
 * This runs on port 3001 and the Vite dev server proxies /api → 3001.
 * See vite.config.js for proxy config.
 *
 * Requires:
 *   npm install -D @vercel/node
 *   Create .env.local with OPENAI_API_KEY=sk-...
 */

import { createServer } from 'http'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local manually
try {
  const envFile = readFileSync(join(__dirname, '.env.local'), 'utf-8')
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim()
    }
  }
  console.log('[DEV] .env.local loaded')
} catch {
  console.warn('[DEV] .env.local not found – OPENAI_API_KEY must be set manually')
}

const PORT = 3001

const server = createServer(async (req, res) => {
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body)
        const { default: handler } = await import('./api/chat.js')

        // Patch res to match Vercel's response interface
        const wrappedRes = {
          statusCode: 200,
          status(code) {
            this.statusCode = code
            return this
          },
          json(data) {
            res.writeHead(this.statusCode, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            })
            res.end(JSON.stringify(data))
          },
          headers: req.headers,
          socket: req.socket,
        }

        await handler(req, wrappedRes)
      } catch (err) {
        console.error('[DEV_SERVER_ERROR]', err)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Internal server error' }))
      }
    })
  } else if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, X-Session-ID' })
    res.end()
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(PORT, () => {
  console.log(`[DEV] API server listening on http://localhost:${PORT}`)
  console.log('[DEV] Start Vite separately: npm run dev')
})
