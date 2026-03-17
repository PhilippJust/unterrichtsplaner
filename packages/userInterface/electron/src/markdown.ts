import { Converter } from 'showdown'

const converter = new Converter()

export const renderMarkdownToHtml = (markdown: string) =>
  converter.makeHtml(markdown)
