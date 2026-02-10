import { contextBridge, ipcRenderer } from 'electron'
import {
  UnterrichtsablaufAnfrage,
  UnterrichtsablaufResult,
} from '../../unterrichtsablauf'

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, data: UnterrichtsablaufAnfrage) => {
    ipcRenderer.send(channel, data)
  },
  on: (channel: string, func: (result: UnterrichtsablaufResult) => void) => {
    ipcRenderer.on(channel, (event, ...args) =>
      func(args[0] as UnterrichtsablaufResult)
    )
  },
})
