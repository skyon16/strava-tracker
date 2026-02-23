import { addMinutes } from "date-fns";

// the scheduler provides a date and we add 15 min for the defualt end time

export const addFifteenMinutes = (date: Date) => addMinutes(date, 15);
