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
  const unterrichtsablauf = await generator.generiere({
    dauer: 45,
    fach: 'Geografie',
    klassengroesse: 25,
    klassenstufe: 8,
    schulform: 'Oberschule',
    themengebiet: 'Globalisierung',
    zielsetzung:
      'Die Schüler sollen verstehen, was Globalisierung bedeutet, welche Auswirkungen sie hat und wie sie sich auf verschiedene Lebensbereiche auswirkt.',
  })
  console.log(JSON.stringify(unterrichtsablauf, null, 2))
  const anmerkungen = await waitForUserInput(
    'Bitte gib deine Anmerkungen ein: '
  )
  const neueVersion = await generator.iteriere(anmerkungen)
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
