import { useMemo } from "react"

export function useCalendarEvents(schedules) {

  const events = useMemo(() => {

    if (!schedules) return []

    return schedules.flatMap((s) =>
      (s.dates || []).map((d) => ({
        id: d.id,
        title: s.title,
        start: d.start_date,
        end: d.end_date,

        color: s.category?.color || "#000",

        extendedProps: {
          schedule: s
        }
      }))
    )

  }, [schedules])

  return { events }
}