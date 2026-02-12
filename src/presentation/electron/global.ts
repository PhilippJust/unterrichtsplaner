import type {
  UnterrichtsablaufAnfrage,
  Unterrichtsablauf,
} from '../../unterrichtsablauf'

export interface IElectronAPI {
  send: (channel: string, data: UnterrichtsablaufAnfrage) => void
  on: (channel: string, func: (result: Unterrichtsablauf) => void) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
