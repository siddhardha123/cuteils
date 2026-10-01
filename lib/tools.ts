export const tools = [
  { title: 'JSON Formatter', description: 'Validate and prettify JSON with consistent indentation.', href: '/tools/json-formatter', category: 'JSON' },
  { title: 'JSON to CSV', description: 'Turn an array of JSON objects into a CSV file.', href: '/tools/json-to-csv', category: 'JSON' },
  { title: 'JSON Corrector', description: 'Repair single quotes, unquoted keys, and trailing commas.', href: '/tools/json-corrector', category: 'JSON' },
  { title: 'JSON Diff', description: 'Compare JSON values and see what changed at each path.', href: '/tools/json-diff', category: 'JSON' },
  { title: 'JWT Parser', description: 'Decode a JWT header and payload. Signatures are not verified.', href: '/tools/jwt-parser', category: 'Auth' },
  { title: 'TOTP Generator', description: 'Generate a rotating one-time code from a Base32 secret.', href: '/tools/totp-generator', category: 'Auth' },
  { title: 'Timestamp Converter', description: 'Convert Unix seconds or milliseconds to a date and time.', href: '/tools/timestamp-converter', category: 'Time' },
  { title: 'Time Unit Converter', description: 'Convert durations between milliseconds, seconds, and more.', href: '/tools/time-unit-converter', category: 'Time' },
  { title: 'URL Inspector', description: 'Inspect URLs, edit query parameters, and encode or decode components.', href: '/tools/url-inspector', category: 'Encoding' },
  { title: 'Base64 Codec', description: 'Encode and decode UTF-8 text using Base64 or Base64URL.', href: '/tools/base64-codec', category: 'Encoding' },
  { title: 'Text Diff', description: 'Compare text, logs, and configs with additions and removals.', href: '/tools/text-diff', category: 'Text' },
  { title: 'Cron Explainer', description: 'Read a cron schedule and preview its next five runs in your timezone.', href: '/tools/cron-explainer', category: 'Time' },
  { title: 'CSV to JSON', description: 'Convert CSV with headers into JSON, with optional type detection.', href: '/tools/csv-to-json', category: 'JSON' },
  { title: 'Regex Playground', description: 'Test JavaScript regex patterns, inspect captures, and preview replacements.', href: '/tools/regex-playground', category: 'Text' },
] as const

export const categories = ['All', ...new Set(tools.map(tool => tool.category))]
