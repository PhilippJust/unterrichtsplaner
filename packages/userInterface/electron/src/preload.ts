import { contextBridge, ipcRenderer } from 'electron'
import {
  UnterrichtsablaufAnfrage,
  Unterrichtsablauf,
} from '@unterrichtsplaner/core'
import { enableTab, selectTab, type Tab } from './tab'

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, data: UnterrichtsablaufAnfrage) => {
    ipcRenderer.send(channel, data)
  },
  on: (channel: string, func: (result: Unterrichtsablauf) => void) => {
    ipcRenderer.on(channel, (event, ...args) =>
      func(args[0] as Unterrichtsablauf)
    )
  },
  enableAndSwitchTab: (id: Tab) => {
    enableTab(id)
    selectTab(id)
  },
})
