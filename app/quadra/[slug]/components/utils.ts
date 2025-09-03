// app/quadra/[slug]/components/utils.ts
export function isoDateKey(date: Date) {
  // chave AAAA-MM-DD usando fuso local
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function isDateUnavailableFactory(unavailableDates: string[]) {
  return (date: Date) => unavailableDates.includes(isoDateKey(date))
}

export function isTimeOccupiedFactory(occupiedSlots: Record<string, string[]>) {
  return (date: Date | undefined, time: string) => {
    if (!date) return false
    const list = occupiedSlots[isoDateKey(date)] ?? []
    return list.includes(time)
  }
}

export function addOneHourLabel(hhmm: string) {
  const [h] = hhmm.split(":").map(Number)
  const next = String(h + 1).padStart(2, "0") + ":00"
  return `${hhmm} - ${next}`
}
