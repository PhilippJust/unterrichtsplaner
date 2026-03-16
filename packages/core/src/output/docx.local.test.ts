import { describe, it, expect } from 'vitest'
import { arbeitsblattToDocx, unterrichtsAblaufToDocx } from './docx'
import { writeFileSync } from 'fs'
import { join } from 'path'

describe('DOCX Generator', () => {
  it('should generate DOCX from Unterrichtsablauf', async () => {
    const result = await unterrichtsAblaufToDocx({
      thema: 'Testthema DOCX',
      lernziele: ['Lernziel 1', 'Lernziel 2'],
      einstiegsphase: [
        {
          dauer: 5,
          ziel: 'Einstiegsziel',
          beschreibung: 'Einstiegsbeschreibung',
          material: 'Einstiegsmaterial',
        },
      ],
      erarbeitungsphase: [
        {
          dauer: 20,
          ziel: 'Erarbeitungsziel 1',
          beschreibung: 'Erarbeitungsbeschreibung 1',
          material: 'Erarbeitungsmaterial 1',
        },
        {
          dauer: 10,
          ziel: 'Erarbeitungsziel 2',
          beschreibung: 'Erarbeitungsbeschreibung 2',
          material: 'Erarbeitungsmaterial 2',
        },
      ],
      sicherungsphase: [
        {
          dauer: 10,
          ziel: 'Sicherungsziel',
          beschreibung: 'Sicherungsbeschreibung',
          material: 'Sicherungsmaterial',
        },
      ],
    })

    expect(result).toBeInstanceOf(Buffer)
    expect(result.length).toBeGreaterThan(0)

    writeFileSync(join(__dirname, 'testoutput/unterrichtsablauf.docx'), result)
  })

  it('should generate DOCX from Arbeitsblatt', async () => {
    const result = await arbeitsblattToDocx({
      thema: 'Testthema Arbeitsblatt',
      aufgaben: [
        {
          aufgabenstellung: 'Eine Testaufgabe',
          dauer: 10,
          musterloesung: 'Musterlösung zur Testaufgabe',
          anzahlLoesungszeilen: 3,
        },
        {
          aufgabenstellung: 'Vergleiche die Haikus',
          dauer: 10,
          musterloesung: 'Musterlösung zur Testaufgabe',
          material: {
            text: [
              `Alte Teiche, ein Frosch springt hinein, Platsch!`,
              `Sommerregen, auf dem Dach ein Tropfen, leise Musik.`,
            ],
          },
          anzahlLoesungszeilen: 10,
        },
      ],
    })

    writeFileSync(
      join(__dirname, 'testoutput/arbeitsblatt.docx'),
      result.arbeitsblatt
    )
    writeFileSync(
      join(__dirname, 'testoutput/arbeitsblatt_ musterloesung.docx'),
      result.musterloesung
    )
  })
})
