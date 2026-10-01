import assert from 'node:assert/strict'
import { test } from 'node:test'
import { inspectUrl, rebuildUrl, transformUrlComponent } from '../lib/url-utils.ts'
import { encodeBase64, decodeBase64 } from '../lib/base64-utils.ts'
import { csvToJson } from '../lib/csv-utils.ts'
import { compareText } from '../lib/text-diff.ts'
import { explainCron } from '../lib/cron-utils.ts'
import { testRegex } from '../lib/regex-utils.ts'

test('URL inspection decodes parameters while preserving duplicates and fragments', () => {
  const result = inspectUrl('https://example.com:8443/a?q=hello+world&tag=a&tag=b#results')
  assert.deepEqual(result.parameters, [{ key: 'q', value: 'hello world' }, { key: 'tag', value: 'a' }, { key: 'tag', value: 'b' }])
  assert.equal(result.port, '8443')
  assert.equal(result.hash, '#results')
  assert.equal(rebuildUrl(result.href, [{ key: 'q', value: 'a+b & 🎀' }, { key: 'tag', value: 'a' }, { key: 'tag', value: 'b' }]), 'https://example.com:8443/a?q=a%2Bb+%26+%F0%9F%8E%80&tag=a&tag=b#results')
  assert.equal(rebuildUrl(result.href, []), 'https://example.com:8443/a#results')
})

test('URL validation and component encoding handle invalid and Unicode inputs', () => {
  assert.throws(() => inspectUrl('example.com'), /complete URL/)
  assert.throws(() => inspectUrl('javascript:alert(1)'), /HTTP or HTTPS/)
  const encoded = transformUrlComponent('a+b & नमस्ते 🎀', 'encode')
  assert.equal(transformUrlComponent(encoded, 'decode'), 'a+b & नमस्ते 🎀')
  assert.equal(transformUrlComponent('a+b', 'decode'), 'a+b')
  assert.throws(() => transformUrlComponent('%E0%A4', 'decode'), /Invalid percent/)
})

test('Base64 and Base64URL round-trip Unicode and handle padded or unpadded text', () => {
  for (const alphabet of ['base64', 'base64url']) {
    for (const value of ['f', 'fo', 'foo', 'सिड 🎀', '\u0000', '😀'.repeat(3000)]) {
      assert.equal(decodeBase64(encodeBase64(value, alphabet), alphabet), value)
    }
  }
  assert.equal(encodeBase64('Cuteils'), 'Q3V0ZWlscw==')
  assert.equal(decodeBase64(' Q3V0\nZWlscw '), 'Cuteils')
  assert.equal(decodeBase64('8J-YgA', 'base64url'), '😀')
  assert.throws(() => decodeBase64('8J-YgA', 'base64'), /valid Base64/)
})

test('Base64 rejects invalid alphabets, padding, padding bits, and binary data', () => {
  for (const value of ['!', 'Z', 'Zg=', 'Zg===', 'Z=h=', 'Zh==', '====', '   ']) assert.throws(() => decodeBase64(value))
  assert.throws(() => decodeBase64('/w=='), /not valid UTF-8/)
})

test('CSV parses escaped quotes, commas, and multiline cells with string values by default', () => {
  const result = csvToJson('name,note,count\r\n"Sid, Dev","line 1\nline ""2""",2\r\n')
  assert.deepEqual(JSON.parse(result.json), [{ name: 'Sid, Dev', note: 'line 1\nline "2"', count: '2' }])
  assert.equal(result.rows, 1)
  assert.equal(result.columns, 3)
})

test('CSV auto-detects tabs, accepts BOMs and custom delimiters, and handles header-only input', () => {
  assert.deepEqual(JSON.parse(csvToJson('\uFEFFname\tage\nSid\t30').json), [{ name: 'Sid', age: '30' }])
  assert.deepEqual(JSON.parse(csvToJson('name;age\nSid;30', ';').json), [{ name: 'Sid', age: '30' }])
  assert.deepEqual(JSON.parse(csvToJson('name\nSid').json), [{ name: 'Sid' }])
  assert.deepEqual(JSON.parse(csvToJson('name,age').json), [])
})

test('CSV type detection preserves leading zeros and large integers', () => {
  const result = csvToJson('count,active,empty,id,big\n2,true,null,001,9007199254740993', ',', true)
  assert.deepEqual(JSON.parse(result.json), [{ count: 2, active: true, empty: null, id: '001', big: '9007199254740993' }])
  assert.deepEqual(JSON.parse(csvToJson('__proto__,constructor\nx,y').json), JSON.parse('[{"__proto__":"x","constructor":"y"}]'))
})

test('CSV rejects malformed rows and ambiguous headers', () => {
  for (const value of ['', 'a,a\n1,2', 'a,\n1,2', 'a,b\n1', 'a,b\n1,2,3', 'a,b\n"unfinished,2']) assert.throws(() => csvToJson(value))
})

test('Text diff identifies whole-line additions and removals, including empty sides', () => {
  const result = compareText('a\nb\n', 'a\nc\nd\n')
  assert.equal(result.added, 2)
  assert.equal(result.removed, 1)
  assert.equal(result.lines[0].oldLine, 1)
  assert.equal(result.lines[0].newLine, 1)
  assert.match(result.text, /- b/)
  assert.match(result.text, /\+ c/)
  assert.equal(compareText('', 'a\n').added, 1)
  assert.equal(compareText('a\n', '').removed, 1)
  assert.equal(compareText('', '').equal, true)
})

test('Text diff normalizes line endings, optionally ignores edge whitespace, and detects final newlines', () => {
  assert.equal(compareText('a\r\nb\r\n', 'a\nb\n').equal, true)
  assert.equal(compareText(' a \n', 'a\n', true).equal, true)
  assert.equal(compareText(' a \n', 'a\n').equal, false)
  assert.match(compareText('a\n', 'a').text, /No newline at end of file/)
})

test('Cron previews weekdays in IST using an explicit starting instant', () => {
  const result = explainCron('0 9 * * 1-5', 'Asia/Kolkata', new Date('2026-10-02T04:00:00Z'))
  assert.equal(result.dates[0], '2026-10-05T03:30:00.000Z')
  assert.equal(result.dates.length, 5)
  assert.match(result.description, /09:00/)
})

test('Cron supports aliases, seconds, calendar names, and OR semantics for day fields', () => {
  const start = new Date('2026-01-02T00:00:00Z')
  assert.equal(explainCron('@daily', 'UTC', start).dates[0], '2026-01-03T00:00:00.000Z')
  assert.equal(explainCron('*/15 * * * * *', 'UTC', start).dates[0], '2026-01-02T00:00:15.000Z')
  assert.equal(explainCron('0 9 * JAN MON', 'UTC', start).dates[0], '2026-01-05T09:00:00.000Z')
  const both = explainCron('0 9 1 * MON', 'UTC', start)
  assert.match(both.description, / OR /)
  assert.equal(both.dates[0], '2026-01-05T09:00:00.000Z')
})

test('Cron preserves wall-clock schedules across daylight saving transitions', () => {
  const result = explainCron('0 9 * * *', 'America/New_York', new Date('2026-03-07T13:00:00Z'))
  assert.deepEqual(result.dates.slice(0, 3), ['2026-03-07T14:00:00.000Z', '2026-03-08T13:00:00.000Z', '2026-03-09T13:00:00.000Z'])
})

test('Cron rejects invalid fields, unsupported syntax, and invalid dates or timezones', () => {
  for (const value of ['', '* *', '70 * * * *', '@reboot', 'H * * * *', '0 0 31 2 *']) assert.throws(() => explainCron(value, 'UTC'))
  assert.throws(() => explainCron('* * * * *', 'Invalid/Zone'))
  assert.throws(() => explainCron('* * * * *', 'UTC', new Date('invalid')))
})

test('Regex reports indexes, captures, named groups, and optional replacements', () => {
  const result = testRegex('(?<name>[a-z]+)@(example)', 'g', 'sid@example alex@example', '$<name>')
  assert.equal(result.matches.length, 2)
  assert.equal(result.matches[1].index, 12)
  assert.deepEqual(result.matches[0].groups, ['sid', 'example'])
  assert.deepEqual(result.matches[0].namedGroups, { name: 'sid' })
  assert.equal(result.replacement, 'sid alex')
  assert.equal(testRegex('(a)?b', 'g', 'b').matches[0].groups[0], null)
  assert.equal(testRegex('a', '', 'aaa').matches.length, 1)
})

test('Regex handles empty matches, Unicode, sticky matching, truncation, and invalid patterns', () => {
  assert.deepEqual(testRegex('', 'gu', '😀').matches.map(match => match.index), [0, 2])
  assert.equal(testRegex('a', 'y', 'ba').matches.length, 0)
  assert.equal(testRegex('a', 'gy', 'aaba').matches.length, 2)
  const many = testRegex('a', 'g', 'a'.repeat(501))
  assert.equal(many.matches.length, 500)
  assert.equal(many.truncated, true)
  assert.throws(() => testRegex('[', 'g', 'text'))
  assert.throws(() => testRegex('a', 'gg', 'text'))
  assert.throws(() => testRegex('a', 'x', 'text'))
})
