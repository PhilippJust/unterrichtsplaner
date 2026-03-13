import {
  ArbeitsblattGenerator,
  GeminiClient,
  UnterrichtsablaufGenerator,
} from '@unterrichtsplaner/core'
import dotenv from 'dotenv'

dotenv.config()

const geminiClient = new GeminiClient()

const main = async () => {
  const generator = new UnterrichtsablaufGenerator(geminiClient)
  const unterrichtsablauf = await generator.generiere({
    dauer: 45,
    fach: 'Mathematik',
    klassengroesse: 25,
    klassenstufe: 9,
    schulform: 'Oberschule',
    themengebiet: 'Trigonometrie',
    zielsetzung:
      'Die Schüler sollen den Sinussatz kennenlernen und anwenden können',
  })
  console.log(JSON.stringify(unterrichtsablauf, null, 2))
  const arbeitsblattGenerator = new ArbeitsblattGenerator(geminiClient)
  const arbeitsblatt = await arbeitsblattGenerator.generiere(undefined)
  console.log(JSON.stringify(arbeitsblatt, null, 2))
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fehler:', error)
    process.exit(1)
  })
