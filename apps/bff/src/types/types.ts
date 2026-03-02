declare enum EventRepetition {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Biweekly = 3,
  Monthly = 4,
  Annually = 5,
  Weekday = 6,
}
interface DateRange {
  from: Date;
  to: Date;
}

interface SchedulerCalendar {
  name: string;
  enabled: boolean | (() => boolean);
}

interface SchedulerEvent extends DateRange {
  calendar: SchedulerCalendar | Array<SchedulerCalendar>;
  is_current: boolean;
  style?: { backgroundColor?: string };
}

export interface event extends SchedulerEvent {
  name: string;
  repeat: EventRepetition;
  original?: SchedulerEvent;
}
