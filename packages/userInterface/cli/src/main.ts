import { generateUnterrichtsablauf } from '../../../core/src/unterrichtsablauf'

const main = async () => {
  const unterrichtsablauf = await generateUnterrichtsablauf({
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
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fehler:', error)
    process.exit(1)
  })
