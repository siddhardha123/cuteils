import assert from 'node:assert/strict'
import { test } from 'node:test'
import { jsonToCsv, correctJson, compareJson, decodeJwt } from '../lib/tool-utils.ts'

test('CSV escapes commas, quotes, and newlines and includes columns from all rows', () => {
  const input = JSON.stringify([{ name: 'Sid, "Dev"', note: 'line 1\nline 2' }, { name: 'Alex', extra: 0 }])
  assert.equal(jsonToCsv(input), 'name,note,extra\r\n"Sid, ""Dev""","line 1\nline 2",\r\nAlex,,0')
})

test('CSV handles nested values and missing cells without inherited property values', () => {
  assert.equal(jsonToCsv('[{"data":{"a":1},"flag":false},{"constructor":"own"}]'), 'data,flag,constructor\r\n"{""a"":1}",false,\r\n,,own')
  for (const input of ['[]', '{}', '[null]', '[1]', '[[]]', '[{}]']) assert.throws(() => jsonToCsv(input))
})

test('JSON correction repairs syntax while preserving quoted content', () => {
  const repaired = correctJson(`{name: 'Cuteils', tools: ['JSON',], url: 'https://example.com', text: "don't change key: or ,}",}`)
  assert.deepEqual(JSON.parse(repaired), { name: 'Cuteils', tools: ['JSON'], url: 'https://example.com', text: "don't change key: or ,}" })
  assert.deepEqual(JSON.parse(correctJson(String.raw`{text: 'it\'s "fine"',}`)), { text: 'it\'s "fine"' })
  assert.throws(() => correctJson("{text: 'unfinished}"))
})

test('JSON correction preserves already valid JSON, including escaped strings', () => {
  const value = { path: 'C:\\tools', quote: '"hello"', text: 'a,b}', nested: [null, 3] }
  assert.deepEqual(JSON.parse(correctJson(JSON.stringify(value))), value)
})

test('JSON diff ignores object key order and reports added, removed, changed values', () => {
  assert.match(compareJson('{"a":1,"b":2}', '{"b":2,"a":1}'), /No differences/)
  assert.equal(compareJson('{"a":1,"gone":2}', '{"a":3,"new":false}'), 'Changed $["a"]: 1 → 3\nRemoved $["gone"]: 2\nAdded $["new"]: false')
  assert.equal(compareJson('[1,2]', '[1,3,4]'), 'Changed $[1]: 2 → 3\nAdded $[2]: 4')
  assert.equal(compareJson('null', '{}'), 'Changed $: null → {}')
  assert.throws(() => compareJson('', '{}'), /Original JSON/)
  assert.throws(() => compareJson('{}', '{'), /Updated JSON/)
})

test('JWT decoding supports Base64URL and UTF-8 payloads', () => {
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url')
  const header = { alg: 'none', typ: 'JWT' }, payload = { name: 'सिड 🎀', sub: 'demo' }
  assert.deepEqual(decodeJwt(`${encode(header)}.${encode(payload)}.`), { header, payload })
  assert.throws(() => decodeJwt('invalid'), /three dot-separated/)
  assert.throws(() => decodeJwt(`${encode(header)}.${encode([])}.`), /Could not decode/)
  assert.throws(() => decodeJwt('@@.@@.signature'), /Could not decode/)
})
