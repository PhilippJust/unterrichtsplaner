import type {
  UnterrichtsablaufAnfrage,
  Unterrichtsablauf,
} from '@unterrichtsplaner/core'

export interface IElectronAPI {
  send: (channel: string, data: UnterrichtsablaufAnfrage) => void
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
