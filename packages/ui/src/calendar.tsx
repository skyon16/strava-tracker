import { type JSX } from "react";

export interface CalendarProps {
  /** The currently selected date */
  selectedDate?: Date;
  /** Callback fired when a date is selected */
  onDateSelect?: (date: Date) => void;
  /** The month to display (defaults to current month) */
  month?: Date;
}

const tempDays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

export function Calendar({
  selectedDate,
  onDateSelect,
  month = new Date(),
}: CalendarProps): JSX.Element {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const monthName = month.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const days: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex w-[600px] h-[800px] ">
      <div className="grid grid-cols-7 w-full h-full overflow-y-auto [scrollbar-width:none]">
        {tempDays.map((day, idx) => (
          <div key={idx} className="text-black flex flex-col items-center">
            {day}
            {idx < tempDays.length - 1 ? (
              <div className="items-end divider divider-horizontal divider-neutral h-full w-full m-0"></div>
            ) : (
              <div className="m-0"></div>
            )}
          </div>
        ))}
      </div>
      <div className="pt-[100px] absolute w-full h-full grid grid-rows-7">
        {tempDays.map((day, idx) => (
          <div className="m-0  divider divider-end divider-neutral w-full h-full"></div>
        ))}
      </div>
    </div>
  );
}
