import type z from 'zod'

export interface IGenAiClient {
  generateTextWithSchema: <
    T extends z.ZodObject<z.core.$ZodLooseShape, z.core.$strip>,
  >(
    prompt: string,
    schema: T
  ) => Promise<z.core.output<T>>
}
