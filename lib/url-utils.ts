export type QueryParameter = { key: string; value: string }

export function inspectUrl(input: string) {
  let url: URL
  try { url = new URL(input.trim()) }
  catch { throw new Error('Enter a complete URL, including https:// or http://.') }
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Use an HTTP or HTTPS URL.')
  return {
    href: url.href,
    protocol: url.protocol.replace(':', ''),
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? '443 (default)' : '80 (default)'),
    pathname: url.pathname,
    hash: url.hash,
    parameters: [...url.searchParams].map(([key, value]) => ({ key, value })),
  }
}

export function rebuildUrl(input: string, parameters: QueryParameter[]): string {
  const url = new URL(inspectUrl(input).href)
  url.search = ''
  for (const { key, value } of parameters) url.searchParams.append(key, value)
  return url.href
}

export function transformUrlComponent(input: string, mode: 'encode' | 'decode'): string {
  try { return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input) }
  catch { throw new Error(mode === 'decode' ? 'Invalid percent encoding or UTF-8 sequence.' : 'Input contains an invalid Unicode sequence.') }
}
