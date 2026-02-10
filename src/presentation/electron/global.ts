import type {
  UnterrichtsablaufAnfrage,
  UnterrichtsablaufResult,
} from '../../unterrichtsablauf'

export interface IElectronAPI {
  send: (channel: string, data: UnterrichtsablaufAnfrage) => void
  on: (channel: string, func: (result: UnterrichtsablaufResult) => void) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
