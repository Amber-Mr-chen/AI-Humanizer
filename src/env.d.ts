// Cloudflare Workers environment type declarations
interface CloudflareEnv {
  DB: D1Database;
  AI: Ai;
  ASSETS: Fetcher;
}
