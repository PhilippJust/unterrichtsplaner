import type { Unterrichtsablauf } from '@unterrichtsplaner/core'

export interface IElectronAPI {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (channel: string, data: any) => void
  on: (channel: string, func: (result: Unterrichtsablauf) => void) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }

  interface Document {
    enableTab: (id: 'ziel' | 'ablaufplan') => void
    switchTab: (id: 'ziel' | 'ablaufplan') => void
  }
}
