import { GoogleGenAI } from '@google/genai'
import type { z, ZodObject } from 'zod'
import type { IGenAiClient } from './IGenAiClient'

let _client: GoogleGenAI | null = null

function getGeminiClient() {
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

export class GeminiClient implements IGenAiClient {
  private client: GoogleGenAI

  private conversationHistory = new Array<{
    role: 'user' | 'assistant'
    content: string
  }>()

  constructor() {
    this.client = getGeminiClient()
  }

  public generateTextWithSchema = async <T extends ZodObject>(
    prompt: string,
    schema: T
  ) => {
    this.conversationHistory.push({ role: 'user', content: prompt })
    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: this.conversationHistory
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n'),
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: schema.toJSONSchema(),
      },
    })

    if (!response.text) {
      throw new Error('Keine Antwort vom Modell erhalten')
    }

    this.conversationHistory.push({ role: 'assistant', content: response.text })

    const result = JSON.parse(response.text) as z.infer<T>
    return result
  }
}
