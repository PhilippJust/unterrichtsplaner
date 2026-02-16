import { describe, it } from 'vitest'
import { unterrichtsAblaufToRtf } from './rtf'
import { writeFileSync } from 'fs'
import { join } from 'path'

describe('RTF Generator', () => {
  it('should generate RTF from Unterrichtsablauf', () => {
    const result = unterrichtsAblaufToRtf({
      thema: 'Testthema',
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
          ziel: 'Erarbeitungsziel',
          beschreibung: 'Erarbeitungsbeschreibung',
          material: 'Erarbeitungsmaterial',
        },
        {
          dauer: 10,
          ziel: 'Erarbeitungsziel',
          beschreibung: 'Erarbeitungsbeschreibung',
          material: 'Erarbeitungsmaterial',
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

    writeFileSync(join(__dirname, 'testoutput/unterrichtsablauf.rtf'), result)
  })
})
