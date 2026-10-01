import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue'

const aliases: Record<string, string> = {
  '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *', '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0', '@daily': '0 0 * * *', '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *', '@minutely': '* * * * *', '@secondly': '* * * * * *',
}

export function explainCron(input: string, timezone: string, from = new Date()) {
  const expression = aliases[input.trim().toLowerCase()] ?? input.trim()
  const fields = expression.split(/\s+/)
  if (![5, 6].includes(fields.length)) throw new Error('Use five cron fields, or six with seconds first. Aliases such as @daily are also supported.')
  if (expression.length > 250 || fields.some(field => !/^[\dA-Za-z*,/#?\-]+$/.test(field))) throw new Error('Unsupported cron syntax. Use values, names, *, ranges, lists, and steps.')
  if (fields.some(field => /(^|,)H(?:$|\/)/i.test(field))) throw new Error('Randomized H schedules are not supported.')
  if (!Number.isFinite(from.getTime())) throw new Error('Enter a valid start date and time.')
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(from)
    const schedule = CronExpressionParser.parse(expression, { tz: timezone, currentDate: from })
    const describe = (value: string) => cronstrue.toString(value, { use24HourTimeFormat: true, throwExceptionOnParseError: true })
    const offset = fields.length === 6 ? 1 : 0
    let description = describe(expression)
    if (!['*', '?'].includes(fields[2 + offset]) && !['*', '?'].includes(fields[4 + offset])) {
      const byMonthDay = [...fields], byWeekDay = [...fields]
      byMonthDay[4 + offset] = '*'
      byWeekDay[2 + offset] = '*'
      description = `${describe(byMonthDay.join(' '))} OR ${describe(byWeekDay.join(' '))}`
    }
    const dates = schedule.take(5).map(date => date.toDate().toISOString())
    return { expression, description, dates }
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause)
    throw new Error(`Invalid schedule: ${message}`)
  }
}
