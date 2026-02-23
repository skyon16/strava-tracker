import type { Meta } from "@storybook/react-vite";

import { Schedule } from "../src/components/Schedule";
import { DateFormMessages } from "../src/components/DateForm";
import { WorkoutCategories } from "@repo/utilities";

const workoutCategories = [
  { id: WorkoutCategories.Run, label: "Run" },
  { id: WorkoutCategories.Cycle, label: "Cycle" },
];

const dateFormMessages: DateFormMessages = {
  category: "Workout Category",
  endDate: "End Date",
  endTime: "End Time",
  startDate: "Start Date",
  startTime: "Start Time",
  title: "Title",
  checkboxLabel: "Repeat",
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

export const Default = () => (
  <Schedule
    workoutCategories={workoutCategories}
    dateFormMessages={dateFormMessages}
  />
);
