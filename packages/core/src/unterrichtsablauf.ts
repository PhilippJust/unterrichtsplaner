import z from 'zod'
import type { IGenAiClient } from './genAi/IGenAiClient'
import { Generator } from './generator'

const aktion = z.object({
  dauer: z.int().describe('Dauer der Aktion in Minuten'),
  ziel: z.string().describe('Ziel der Aktion'),
  beschreibung: z.string().describe('Beschreibung der Aktion'),
  material: z.string().describe('Benötigtes Material für die Aktion'),
})

export type Aktion = z.infer<typeof aktion>

const unterrichtsablauf = z.object({
  thema: z.string().describe('Thema der Unterrichtseinheit'),
  lernziele: z.array(z.string()).describe('Lernziele der Unterrichtseinheit'),
  einstiegsphase: z.array(aktion).describe('Einstiegsphase Aktionen'),
  erarbeitungsphase: z.array(aktion).describe('Erarbeitungsphase Aktionen'),
  sicherungsphase: z.array(aktion).describe('Sicherungsphase Aktionen'),
})

export type Unterrichtsablauf = z.infer<typeof unterrichtsablauf>

const _anfrageSchema = z.object({
  fach: z.string().describe('Fach der Unterrichtseinheit'),
  themengebiet: z.string().describe('Themengebiet der Unterrichtseinheit'),
  zielsetzung: z.string().describe('Zielsetzung der Unterrichtseinheit'),
  dauer: z.int().describe('Dauer der Unterrichtseinheit in Minuten'),
  klassengroesse: z
    .int()
    .describe('Klassengröße (z.B. Einzelunterricht, 20 Schüler)'),
  klassenstufe: z.int().describe('Klassenstufe (z.B. 8)'),
  schulform: z.string().describe('Schulform (z.B. Oberschule)'),
})

export type UnterrichtsablaufAnfrage = z.infer<typeof _anfrageSchema>

export class UnterrichtsablaufGenerator extends Generator<
  UnterrichtsablaufAnfrage,
  Unterrichtsablauf
> {
  constructor(genAiClient: IGenAiClient) {
    super(genAiClient, unterrichtsablauf)
  }

  protected generatePrompt = (anfrage: UnterrichtsablaufAnfrage) =>
    `# Unterrichtsvorbereitung

Du bist eine Lehrkraft an einer deutschen Schule und musst eine Unterrichtseinheit vorbereiten.
Erstelle zunächst einen Ablaufplan inklusive Zeitplan mit den Phasen Einstieg, Erarbeitung und Sicherung.
Berücksichtige die Schulform, Klassenstufe und Klassengröße.

Hier sind deine Rahmenbedingungen:
- Fach: ${anfrage.fach}
- Themengebiet: ${anfrage.themengebiet}
- Zielsetzung der Unterrichtseinheit: ${anfrage.zielsetzung}
- Dauer der Unterrichtseinheit: ${anfrage.dauer} Minuten
- Klassengröße: ${anfrage.klassengroesse} Schüler
- Klassenstufe: ${anfrage.klassenstufe}
- Schulform: ${anfrage.schulform}
`
}
