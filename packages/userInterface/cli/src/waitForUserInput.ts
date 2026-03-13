import { stdin, stdout } from 'node:process'
import readline from 'readline/promises'

export const waitForUserInput = async (question: string): Promise<string> => {
  console.log(question)
  const rl = readline.createInterface({ input: stdin, output: stdout })
  let answer = ''
  while (!answer.trim()) {
    answer = await rl.question(question)
  }
  rl.close()
  return answer
}
