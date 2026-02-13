import {
  GeminiClient,
  UnterrichtsablaufGenerator,
} from '@unterrichtsplaner/core'
import readline from 'readline/promises'
import { stdin, stdout } from 'process'
import dotenv from 'dotenv'

dotenv.config()

const waitForUserInput = async (question: string): Promise<string> => {
  console.log(question)
  const rl = readline.createInterface({ input: stdin, output: stdout })
  let answer = ''
  while (!answer.trim()) {
    answer = await rl.question(question)
  }
  rl.close()
  return answer
}

const main = async () => {
  const generator = new UnterrichtsablaufGenerator(new GeminiClient())
  const unterrichtsablauf = await generator.generateUnterrichtsablauf({
    dauer: 90,
    fach: 'Mathematik',
    klassengroesse: 1,
    klassenstufe: 8,
    schulform: 'Oberschule',
    themengebiet: 'Trigonometrie',
    zielsetzung:
      'Die Schüler sollen die Grundlagen der Trigonometrie verstehen und anwenden können.',
  })
  console.log(JSON.stringify(unterrichtsablauf, null, 2))
  const anmerkungen = await waitForUserInput(
    'Bitte gib deine Anmerkungen ein: '
  )
  const neueVersion = await generator.iteriereUnterrichtsablauf(anmerkungen)
  console.log(JSON.stringify(neueVersion, null, 2))
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fehler:', error)
    process.exit(1)
  })
