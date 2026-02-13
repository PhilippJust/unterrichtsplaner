import { GoogleGenAI, type Chat } from '@google/genai'
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
  private chat: Chat

  constructor() {
    this.client = getGeminiClient()
    this.chat = this.client.chats.create({
      model: 'gemini-2.5-flash',
    })
  }

  public generateTextWithSchema = async <T extends ZodObject>(
    prompt: string,
    schema: T
  ) => {
    const response = await this.chat.sendMessage({
      message: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: schema.toJSONSchema(),
      },
    })

    if (!response.text) {
      throw new Error('Keine Antwort vom Modell erhalten')
    }

    const result = JSON.parse(response.text) as z.infer<T>
    return result
  }
}
