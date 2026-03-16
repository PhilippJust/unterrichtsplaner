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
        {
          aufgabenstellung: 'Welche Aufgaben hat das europäische Parlament?',
          dauer: 25,
          musterloesung: `* Stimmt über Gesetze und den Haushalt ab
* Kontrolliert die EU-Kommission
* Wählt die Präsidentin der EU-Kommission`,
          material: {
            text: [
              `**Europäisches Parlament**

Das Europäische Parlament ist die einzige direkt gewählte Institution der Europäischen Union.
Es vertritt die Interessen der Bürgerinnen und Bürger der EU und hat seinen Hauptsitz in 
Straßburg (Frankreich), wobei weitere Sitzungen und die Verwaltung auch in Brüssel (Belgien)
und Luxemburg stattfinden. Die Abgeordneten des Europäischen Parlaments werden alle fünf Jahre 
in direkten Wahlen von den EU-Bürgern gewählt.  
Es hat drei Kernaufgaben: 
1.  **Gesetzgebung:** 
Es übt zusammen mit dem Rat der Europäischen Union die Gesetzgebungsfunktion aus,
indem es die meisten EU-Gesetze verabschiedet, ändert oder ablehnt. Dies bedeutet,
dass keine wichtigen EU-Gesetze ohne die Zustimmung des Parlaments in Kraft treten können.
2.  **Kontrolle:** 
Es kontrolliert andere EU-Institutionen, insbesondere die Europäische Kommission. 
Dazu gehört die Genehmigung des EU-Haushaltsplans, die Überwachung, wie EU-Gelder ausgegeben werden,
und die Entlastung der Kommission. Das Parlament kann auch Untersuchungsausschüsse einsetzen.
3.  **Wahlrecht und demokratische Aufsicht:**
Es wählt den Präsidenten der Europäischen Kommission und hat das Recht, die gesamte Kommission durch
ein Misstrauensvotum abzulehnen. Dadurch stellt es sicher, dass die Kommission demokratisch legitimiert ist
und zur Rechenschaft gezogen werden kann.`,
            ],
          },
          anzahlLoesungszeilen: 10,
        },
      ],
    })

    writeFileSync(
      join(__dirname, 'testoutput/arbeitsblatt.docx'),
      Buffer.from(await result.arbeitsblatt.arrayBuffer())
    )
    writeFileSync(
      join(__dirname, 'testoutput/arbeitsblatt_ musterloesung.docx'),
      Buffer.from(await result.musterloesung.arrayBuffer())
    )
  })
})
