import z from 'zod'
import type { IGenAiClient } from './genAi/IGenAiClient'

export abstract class Generator<TAnfrage, TOutput> {
  public readonly versionen = new Array<TOutput>()

  constructor(
    readonly genAiClient: IGenAiClient,
    readonly schema: z.ZodObject<z.core.$ZodLooseShape, z.core.$strip>
  ) {}

  protected abstract generatePrompt(anfrage: TAnfrage): string

  public generiere = async (anfrage: TAnfrage): Promise<TOutput> => {
    const prompt = this.generatePrompt(anfrage)
    const result = await this.genAiClient.generateTextWithSchema<
      typeof this.schema
    >(prompt, this.schema)
    this.versionen.push(result as TOutput)
    return result as TOutput
  }

  public iteriere = async (anmerkung: string): Promise<TOutput> => {
    if (this.versionen.length === 0) {
      throw new Error(
        'Es muss mindestens eine Version des Outputs existieren, um eine Iteration zu erstellen.'
      )
    }

    const result = await this.genAiClient.generateTextWithSchema<
      typeof this.schema
    >(anmerkung, this.schema)
    this.versionen.push(result as TOutput)
    return result as TOutput
  }
}
