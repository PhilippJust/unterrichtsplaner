import z from 'zod'
import type { IGenAiClient } from './genAi/IGenAiClient'
import { Generator } from './generator'

const arbeitsblatt = z.object({
  aufgaben: z
    .array(
      z.object({
        aufgabenstellung: z.string().describe('Die Aufgabe für die Schüler'),
        musterloesung: z.string().describe('Eine Musterlösung zu der Aufgabe'),
        dauer: z
          .int()
          .describe(
            'Die geschätzte Dauer zur Bearbeitung der Aufgabe in Minuten'
          ),
        material: z
          .object({
            text: z
              .array(z.string())
              .optional()
              .describe(
                'Textuelles Material, das die Schüler für die Bearbeitung der Aufgabe benötigen'
              ),
            skizzen: z
              .array(z.string())
              .optional()
              .describe(
                'Die Beschreibung von Skizzen, die die Schüler für die Bearbeitung der Aufgabe benötigen'
              ),
            bilder: z
              .array(z.string())
              .optional()
              .describe(
                'URLs zu Bildern, die die Schüler für die Bearbeitung der Aufgabe benötigen'
              ),
          })
          .optional()
          .describe(
            'Materialien, die für die Bearbeitung der Aufgabe benötigt werden'
          ),
        anmerkungen: z
          .string()
          .optional()
          .describe('Anmerkungen oder Hinweise zur Aufgabe'),
      })
    )
    .describe('Aufgaben des Arbeitsblatts'),
})

export type Arbeitsblatt = z.infer<typeof arbeitsblatt>

export class ArbeitsblattGenerator extends Generator<undefined, Arbeitsblatt> {
  constructor(genAiClient: IGenAiClient) {
    super(genAiClient, arbeitsblatt)
  }

  protected generatePrompt = () =>
    // Wir rufen das nach der Generierung des Unterrichtsablaufs innerhalb des Kontext-Fensters auf
    `Erstelle ein Arbeitsblatt inklusive einer Musterlösung für die Unterrichtseinheit.
    Es muss nicht jede Phase des Unterrichtsablaufs eine Aufgabe enthalten, kann aber.
    Achte darauf, den zeitlichen Rahmen nicht zu sprengen.`
}
