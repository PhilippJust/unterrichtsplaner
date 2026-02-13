import { contextBridge, ipcRenderer } from 'electron'
import { Unterrichtsablauf } from '@unterrichtsplaner/core'

contextBridge.exposeInMainWorld('electronAPI', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data)
  },
  on: (channel: string, func: (result: Unterrichtsablauf) => void) => {
    ipcRenderer.on(channel, (event, ...args) =>
      func(args[0] as Unterrichtsablauf)
    )
  },
})
