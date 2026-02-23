import { Meta } from "@storybook/react";
import React from "react";
import { DateForm, DateFormMessages } from "../components/DateForm";

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

const meta: Meta<typeof DateForm> = {
  component: DateForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

export const Example = (args: any) => (
  <DateForm
    onChange={() => {}}
    messages={dateFormMessages}
    endDateTime={new Date()}
    startDateTime={new Date()}
    workoutCategories={[{ id: 1, label: "run" }]}
  />
);

Example.args = {};
//   title: 'Delete folder',
//   children: 'Are you sure you want to delete "Documents"? All contents will be permanently destroyed.',
//   variant: 'destructive',
//   actionLabel: 'Delete'
// };
