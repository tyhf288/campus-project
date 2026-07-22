/**
 * 格式化日期
 * @param date - 日期对象或时间戳
 * @param format - 格式字符串，支持 YYYY/MM/DD/HH/mm/ss
 * @returns 格式化后的日期字符串
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') // "2026-07-22 21:50:32"
 * formatDate(new Date(), 'YYYY/MM/DD') // "2026/07/22"
 */
export function formatDate(date: Date | number, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
