import { generateUnterrichtsablauf } from './unterrichtsablauf'
import dotenv from 'dotenv'

dotenv.config()

const main = async () => {
  console.log('Starte Unterrichtsplaner...')
  const result = await generateUnterrichtsablauf()
  console.log(JSON.stringify(result, null, 2))
}

main()
  .then(() => {
    console.log('Fertig.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Fehler im Unterrichtsplaner:', err)
    process.exit(1)
  })
