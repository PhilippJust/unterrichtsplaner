import { GoogleGenAI, PersonGeneration, type Chat } from '@google/genai'
import type { z, ZodObject } from 'zod'
import type { IGenAiClient } from './IGenAiClient'

export class GeminiClient implements IGenAiClient {
  private client: GoogleGenAI
  private chat: Chat

  constructor(options?: { apiKey?: string }) {
    const apiKey =
      options?.apiKey ||
      (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined)

    if (!apiKey) {
      throw new Error(
        'No API Key provided and GEMINI_API_KEY not set in environment'
      )
    }

    this.client = new GoogleGenAI({ apiKey })
    this.chat = this.client.chats.create({
      model: 'gemini-2.5-flash',
    })
  }

  public generateTextWithSchema = async <
    T extends ZodObject<z.core.$ZodLooseShape, z.core.$strip>,
  >(
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

  /**
   * Geht nicht im Free-Tier
   */
  public createImage = async (prompt: string) => {
    const response = await this.client.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        personGeneration: PersonGeneration.ALLOW_ADULT,
      },
    })
    if (!response.generatedImages?.length) {
      throw new Error('Keine Bilder generiert')
    }
    return response.generatedImages[0]
  }
}
