import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Calendar } from "../calendar";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onDateSelect: fn(),
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelectedDate: Story = {
  args: {
    selectedDate: new Date(),
  },
};

export const CustomMonth: Story = {
  args: {
    month: new Date(2025, 0, 1), // January 2025
  },
};
