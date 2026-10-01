import Papa from 'papaparse'

export function csvToJson(input: string, delimiter = '', inferTypes = false) {
  if (!input.trim()) throw new Error('Paste CSV with a header row first.')
  if (input.length > 1_000_000) throw new Error('Use CSV smaller than 1 MB.')
  const result = Papa.parse<string[]>(input.replace(/^\uFEFF/, ''), { delimiter, skipEmptyLines: true })
  const fatal = result.errors.find(error => error.code !== 'UndetectableDelimiter')
  if (fatal) throw new Error(`CSV error${fatal.row !== undefined ? ` on row ${fatal.row + 1}` : ''}: ${fatal.message}`)
  const [first, ...rows] = result.data
  if (!first?.length) throw new Error('A header row is required.')
  const headers = first.map(header => header.trim())
  if (headers.some(header => !header)) throw new Error('Every column needs a non-empty header.')
  if (new Set(headers).size !== headers.length) throw new Error('Column headers must be unique.')
  const data = rows.map((row, index) => {
    if (row.length !== headers.length) throw new Error(`Row ${index + 2} has ${row.length} cells; expected ${headers.length}.`)
    return Object.fromEntries(headers.map((header, column) => [header, inferTypes ? inferValue(row[column]) : row[column]]))
  })
  return { json: JSON.stringify(data, null, 2), rows: data.length, columns: headers.length, delimiter: result.meta.delimiter }
}

function inferValue(value: string): string | number | boolean | null {
  const trimmed = value.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null') return null
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(trimmed)) {
    const number = Number(trimmed)
    if (Number.isFinite(number) && (!Number.isInteger(number) || Number.isSafeInteger(number))) return number
  }
  return value
}
