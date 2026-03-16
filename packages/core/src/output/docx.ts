import {
  Document,
  Paragraph,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Packer,
  BorderStyle,
} from 'docx'
import type { Unterrichtsablauf, Aktion } from '../unterrichtsablauf'
import type { Arbeitsblatt } from '../arbeitsblatt'
import { convertMarkdownToDocx } from '@mohtasham/md-to-docx'

const createAktionTable = (aktionen: Aktion[]) => {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        children: [new Paragraph({ text: 'Dauer', style: 'TableHeader' })],
        width: { size: 10, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: 'Ziel', style: 'TableHeader' })],
        width: { size: 20, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [
          new Paragraph({ text: 'Beschreibung', style: 'TableHeader' }),
        ],
        width: { size: 50, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: 'Material', style: 'TableHeader' })],
        width: { size: 20, type: WidthType.PERCENTAGE },
      }),
    ],
  })

  const dataRows = aktionen.map(
    (a) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(a.dauer.toString())],
          }),
          new TableCell({
            children: [new Paragraph(a.ziel)],
          }),
          new TableCell({
            children: [new Paragraph(a.beschreibung)],
          }),
          new TableCell({
            children: [new Paragraph(a.material)],
          }),
        ],
      })
  )

  return new Table({
    tableLook: {
      firstRow: true,
    },
    rows: [headerRow, ...dataRows],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      bottom: { style: BorderStyle.DOUBLE, size: 1, color: '000000' },
      insideVertical: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    columnWidths: [10, 20, 50, 20].map((size) => (size / 100) * 9000), // Umrechnung von Prozent zu Twips
  })
}

export const unterrichtsAblaufToDocx = async (
  ablauf: Unterrichtsablauf
): Promise<Buffer> => {
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: 'TableHeader',
          name: 'TableHeader',
          run: {
            bold: true,
          },
        },
      ],
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: ablauf.thema,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: 'Lernziele',
            heading: HeadingLevel.HEADING_2,
          }),
          ...ablauf.lernziele.map(
            (lz) =>
              new Paragraph({
                text: lz,
                bullet: {
                  level: 0,
                },
              })
          ),
          new Paragraph({
            text: 'Ablaufplan',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: 'Einstiegsphase',
            heading: HeadingLevel.HEADING_3,
          }),
          createAktionTable(ablauf.einstiegsphase),
          new Paragraph({
            text: 'Erarbeitungsphase',
            heading: HeadingLevel.HEADING_3,
          }),
          createAktionTable(ablauf.erarbeitungsphase),
          new Paragraph({
            text: 'Sicherungsphase',
            heading: HeadingLevel.HEADING_3,
          }),
          createAktionTable(ablauf.sicherungsphase),
        ],
      },
    ],
  })

  return await Packer.toBuffer(doc)
}

export const arbeitsblattToDocx = async (
  arbeitsblatt: Arbeitsblatt & { thema: string }
): Promise<{ musterloesung: Blob; arbeitsblaetter: Blob[] }> => {
  const arbeitsblattMarkdowns = arbeitsblatt.varianten.map(
    (v) => `# ${arbeitsblatt.thema}${v.variante ? ` - ${v.variante}` : ''}

  ${v.aufgaben
    .map(
      (aufgabe, index) =>
        `## Aufgabe ${index + 1} ${aufgabe.aufgabenstellung}
  ${aufgabe.material?.text ? `${aufgabe.material.text.join('\n\n')}` : ''}
  
  
  \u00A0${'_'.repeat(aufgabe.anzahlLoesungszeilen * 81)}`
    )
    .join('\n\n')}
  `
  )

  const loesungsmarkdown = `${arbeitsblatt.varianten
    .map((v) =>
      v.variante
        ? `# Musterlösung ${arbeitsblatt.thema} - ${v.variante}`
        : `# Musterlösung ${arbeitsblatt.thema}` +
          v.aufgaben
            .map(
              (aufgabe, index) =>
                `## Aufgabe ${index + 1} ${aufgabe.aufgabenstellung}
  ${aufgabe.material?.text ? `${aufgabe.material.text.join('\n\n')}` : ''}
  \n\n---\n\n${aufgabe.musterloesung}`
            )
            .join('\n\n')
    )
    .join('\\pagebreak')}
  `

  return {
    arbeitsblaetter: await Promise.all(
      arbeitsblattMarkdowns.map((md) => convertMarkdownToDocx(md))
    ),
    musterloesung: await convertMarkdownToDocx(loesungsmarkdown),
  }
}
