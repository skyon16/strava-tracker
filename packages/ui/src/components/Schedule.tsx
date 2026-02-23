import React, { useCallback, useState } from "react";
import {
  Scheduler,
  SchedulerEvent,
  SchedulerExistingEvent,
} from "@cubedoodl/react-simple-scheduler";
import { PopoverDateForm } from "./PopoverForm";
import { DateFormMessages } from "./DateForm";
import { WorkoutCategories } from "@repo/utilities";

export const Schedule = ({
  dateFormMessages,
  ...rest
}: {
  workoutCategories: { label: string; id: WorkoutCategories }[];
  dateFormMessages: DateFormMessages;
}) => {
  const [selected, setSelected] = useState(new Date());
  const [startDateTime, setStartDateTime] = useState<Date>(new Date());
  const [endDateTime, setEndDateTime] = useState<Date>(new Date());
  const [events, setEvents] = useState<SchedulerExistingEvent[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleRequestAdd = useCallback((evt: SchedulerEvent) => {
    setStartDateTime(evt.from);
    setEndDateTime(evt.to);
    setIsPopoverOpen(true);
  }, []);

  const onSubmit = useCallback(
    (from: Date, to: Date, name: string, repeat: number, color: string) => {
      const event: SchedulerExistingEvent = {
        name,
        from,
        to,
        calendar: { name: "default", enabled: true },
        repeat: repeat,
        is_current: false,
        style: {
          backgroundColor: color,
        },
      };
      setEvents((p) => [...p, event]);
      setIsPopoverOpen(false);
    },
    [],
  );

  return (
    <>
      <Scheduler
        events={events}
        selected={selected}
        setSelected={setSelected}
        onRequestAdd={handleRequestAdd}
        onRequestEdit={(evt) => alert(evt)}
        editable={true}
      />
      <PopoverDateForm
        dateFormMessages={dateFormMessages}
        isOpen={isPopoverOpen}
        setOpen={setIsPopoverOpen}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        onChange={onSubmit}
        {...rest}
      />
    </>
  );
};
