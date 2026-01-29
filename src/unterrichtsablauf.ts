import z from 'zod'
import { getGeminiClient } from './geminiClient'

const aktion = z.object({
  dauer: z.int().describe('Dauer der Aktion in Minuten'),
  ziel: z.string().describe('Ziel der Aktion'),
  beschreibung: z.string().describe('Beschreibung der Aktion'),
  material: z.string().describe('Benötigtes Material für die Aktion'),
})

const unterrichtsablaufSchema = z.object({
  thema: z.string().describe('Thema der Unterrichtseinheit'),
  lernziele: z.array(z.string()).describe('Lernziele der Unterrichtseinheit'),
  einstiegsphase: z.array(aktion).describe('Einstiegsphase Aktionen'),
  erarbeitungsphase: z.array(aktion).describe('Erarbeitungsphase Aktionen'),
  sicherungsphase: z.array(aktion).describe('Sicherungsphase Aktionen'),
})

const generatePrompt = () =>
  `# Unterrichtsvorbereitung

Du bist eine Lehrkraft an einer deutschen Schule und musst eine Unterrichtseinheit vorbereiten.
Erstelle zunächst einen Ablaufplan inklusive Zeitplan mit den Phasen Einstieg, Erarbeitung und Sicherung.
Berücksichtige die Schulform, Klassenstufe und Klassengröße.

Hier sind deine Rahmenbedingungen:
- Fach: Mathematik
- Themengebiet: Trigonometrie
- Zielsetzung der Unterrichtseinheit: Festigung von Sinus, Kosinus, Tangens und des Sinussatzes
- Dauer der Unterrichtseinheit: 45 Minuten
- Klassengröße: Einzelunterricht
- Klassenstufe: 8
- Schulform: Oberschule
`

export const generateUnterrichtsablauf = async () => {
  const response = await getGeminiClient().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: generatePrompt(),
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: unterrichtsablaufSchema.toJSONSchema(),
    },
  })

  if (!response.text) {
    throw new Error('Keine Antwort vom Modell erhalten')
  }

  console.log('Rohantwort vom Modell:', JSON.stringify(response, null, 2))

  return JSON.parse(response.text) as z.infer<typeof unterrichtsablaufSchema>
}
