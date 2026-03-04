import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import dotenv from 'dotenv'
import {
  GeminiClient,
  UnterrichtsablaufGenerator,
  unterrichtsAblaufToRtf,
  type Unterrichtsablauf,
  type UnterrichtsablaufAnfrage,
} from '@unterrichtsplaner/core'
import fs from 'fs'

dotenv.config()

let mainWindow: BrowserWindow | null = null

const genAiClient = new GeminiClient()
const unterrichtsablaufGenerator = new UnterrichtsablaufGenerator(genAiClient)

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

ipcMain.on(
  'generate-unterrichtsablauf',
  async (event, anfrage: UnterrichtsablaufAnfrage) => {
    try {
      const result =
        await unterrichtsablaufGenerator.generateUnterrichtsablauf(anfrage)
      event.sender.send('unterrichtsablauf-generated', result)
    } catch (error) {
      // Handle error appropriately
      console.error(error)
      event.sender.send('generation-error', {
        message: (error as Error).message,
      })
    }
  }
)

ipcMain.on('save-unterrichtsablauf', (event, content: Unterrichtsablauf) => {
  if (!mainWindow) {
    return
  }
  dialog
    .showSaveDialog(mainWindow, {
      title: 'Ablaufplan speichern',
      defaultPath: 'unterrichtsablauf.rtf',
      filters: [
        {
          name: 'Rich Text Format',
          extensions: ['rtf'],
        },
      ],
    })
    .then((result) => {
      if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, unterrichtsAblaufToRtf(content))
      }
    })
})

ipcMain.on('iteriere-unterrichtsablauf', async (event, anmerkung: string) => {
  try {
    const result =
      await unterrichtsablaufGenerator.iteriereUnterrichtsablauf(anmerkung)
    event.sender.send('unterrichtsablauf-generated', result)
  } catch (error) {
    // Handle error appropriately
    console.error(error)
    event.sender.send('generation-error', { message: (error as Error).message })
  }
})
