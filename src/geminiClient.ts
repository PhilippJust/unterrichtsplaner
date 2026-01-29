import { GoogleGenAI } from '@google/genai'

let _client: GoogleGenAI | null = null

export function getGeminiClient() {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables')
    }
    _client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  }
  return _client
}
