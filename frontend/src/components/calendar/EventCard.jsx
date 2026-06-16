import { getCategoryTheme } from "../../utils/getCategoryTheme";

export default function EventCard({ event, timeText }) {
  const theme = getCategoryTheme(event.extendedProps.schedule.category?.color);

  return (
    <div
      className="h-full overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm"
      style={{
        borderLeft: `4px solid ${theme.border}`,
      }}
    >
      <div className="flex h-full flex-col px-3">
        <div className="hidden text-[12px] font-semibold text-[#374151] md:block">
          {timeText}
        </div>

        <div className="flex items-center gap-1.5 text-[14px] font-bold md:mt-1">
          <span
            className="hidden h-2 w-2 rounded-full md:block"
            style={{ backgroundColor: theme.border }}
          />

          <span style={{ color: theme.border }}>{event.title}</span>
        </div>
      </div>
    </div>
  );
}
