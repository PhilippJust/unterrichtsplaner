import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { generateUnterrichtsablauf } from '@unterrichtsplaner/core'
import dotenv from 'dotenv'

dotenv.config()

let mainWindow: BrowserWindow | null = null

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

ipcMain.on('generate-unterrichtsablauf', async (event, anfrage) => {
  try {
    const result = await generateUnterrichtsablauf(anfrage)
    event.sender.send('unterrichtsablauf-generated', result)
  } catch (error) {
    // Handle error appropriately
    console.error(error)
    event.sender.send('generation-error', { message: (error as Error).message })
  }
})
