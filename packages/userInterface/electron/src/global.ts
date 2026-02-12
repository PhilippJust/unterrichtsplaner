import type {
  UnterrichtsablaufAnfrage,
  Unterrichtsablauf,
} from '@unterrichtsplaner/core'
import type { Tab } from './tab'

export interface IElectronAPI {
  send: (channel: string, data: UnterrichtsablaufAnfrage) => void
  on: (channel: string, func: (result: Unterrichtsablauf) => void) => void
  enableAndSwitchTab: (id: Tab) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
