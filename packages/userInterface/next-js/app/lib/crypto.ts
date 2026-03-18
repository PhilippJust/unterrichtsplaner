/**
 * Utility for optional encryption using Web Crypto API
 */

const enc = new TextEncoder()
const dec = new TextDecoder()

async function deriveKey(password: string, salt: Uint8Array) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}

function bufToB64(buf: Uint8Array | ArrayBuffer): string {
  const array = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  return btoa(String.fromCharCode(...array))
}

function b64ToBuf(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

export interface EncryptedData {
  encrypted: boolean
  data: string
  iv?: string
  salt?: string
}

export async function encryptData(
  text: string,
  password?: string
): Promise<EncryptedData> {
  if (!password) {
    return { encrypted: false, data: text }
  }

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)

  const encryptedContent = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    enc.encode(text)
  )

  return {
    encrypted: true,
    data: bufToB64(encryptedContent),
    iv: bufToB64(iv),
    salt: bufToB64(salt),
  }
}

export async function decryptData(
  stored: EncryptedData,
  password?: string
): Promise<string> {
  if (!stored.encrypted) {
    return stored.data
  }

  if (!password) {
    throw new Error('Passwort erforderlich für verschlüsselte Daten')
  }

  if (!stored.iv || !stored.salt) {
    throw new Error('Ungültige verschlüsselte Daten: IV oder Salt fehlt')
  }

  const salt = b64ToBuf(stored.salt)
  const iv = b64ToBuf(stored.iv)
  const encryptedContent = b64ToBuf(stored.data)
  const key = await deriveKey(password, salt)

  try {
    const decryptedContent = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      encryptedContent as BufferSource
    )
    return dec.decode(decryptedContent)
  } catch (e) {
    console.error('Fehler beim Entschlüsseln:', e)
    throw new Error('Falsches Passwort oder beschädigte Daten')
  }
}
