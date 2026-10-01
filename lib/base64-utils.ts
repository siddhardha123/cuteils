export type Base64Alphabet = 'base64' | 'base64url'

export function encodeBase64(input: string, alphabet: Base64Alphabet = 'base64'): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (let index = 0; index < bytes.length; index += 4096) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 4096))
  }
  const encoded = btoa(binary)
  return alphabet === 'base64url' ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : encoded
}

export function decodeBase64(input: string, alphabet: Base64Alphabet = 'base64'): string {
  const compact = input.replace(/[\t\r\n ]/g, '')
  const pattern = alphabet === 'base64url' ? /^[A-Za-z0-9_-]*={0,2}$/ : /^[A-Za-z0-9+/]*={0,2}$/
  if (!compact || !pattern.test(compact) || compact.length % 4 === 1 || (compact.includes('=') && compact.length % 4 !== 0)) {
    throw new Error(`Enter valid ${alphabet === 'base64url' ? 'Base64URL' : 'Base64'} text.`)
  }
  const normalized = compact.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '')
  let binary: string
  try {
    binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
    if (btoa(binary).replace(/=+$/, '') !== normalized) throw new Error('Invalid padding bits')
  } catch { throw new Error('Invalid Base64 encoding or padding.') }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, character => character.charCodeAt(0)))
  } catch { throw new Error('Decoded bytes are not valid UTF-8 text. This tool decodes text, not binary files.') }
}
