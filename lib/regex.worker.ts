import { testRegex } from './regex-utils'

const worker = self as unknown as {
  onmessage: ((event: MessageEvent<{ pattern: string; flags: string; text: string; replacement: string | null }>) => void) | null
  postMessage: (value: unknown) => void
}

worker.onmessage = event => {
  try {
    const { pattern, flags, text, replacement } = event.data
    worker.postMessage({ result: testRegex(pattern, flags, text, replacement) })
  } catch (cause) {
    worker.postMessage({ error: cause instanceof Error ? cause.message : 'Invalid regular expression.' })
  }
}

worker.postMessage({ ready: true })
