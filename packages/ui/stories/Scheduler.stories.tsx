import type { Meta } from "@storybook/react-vite";

import { Schedule } from "../src/components/Schedule";
import { DateFormMessages } from "../src/components/DateForm";
import { WorkoutCategories } from "@repo/utilities";
import { useState } from "react";
import { SchedulerExistingEvent } from "@cubedoodl/react-simple-scheduler";

const workoutCategories = [
  { id: WorkoutCategories.Run, label: "Run" },
  { id: WorkoutCategories.Cycle, label: "Cycle" },
];

const dateFormMessages: DateFormMessages = {
  category: "Workout Category",
  endDate: "End Date",
  startDate: "Start Date",
  title: "Title",
  color: "Color",
  submit: "Submit",
};

const meta = {
  title: "UI/Calendar",
  component: Schedule,
  parameters: {},
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Schedule>;

export default meta;

export const Default = () => {
  const [events, setEvents] = useState<SchedulerExistingEvent[]>([]);
  return (
    <Schedule
      workoutCategories={workoutCategories}
      dateFormMessages={dateFormMessages}
      events={events}
      setEvents={setEvents as (events: SchedulerExistingEvent[]) => void}
    />
  );
};
