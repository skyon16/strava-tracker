import { Meta } from "@storybook/react";
import React from "react";
import { PopoverDateForm } from "../components/PopoverForm";
import { DateFormMessages } from "../components/DateForm";

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

const meta: Meta<typeof PopoverDateForm> = {
  component: PopoverDateForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

export const Example = (args: any) => (
  <PopoverDateForm
    isOpen={true}
    setOpen={() => null}
    dateFormMessages={dateFormMessages}
  />
);

Example.args = {};
