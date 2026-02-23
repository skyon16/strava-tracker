import { Color, Form, Key, parseColor, Text } from "react-aria-components";
import {
  fromDate,
  CalendarDateTime,
  toCalendarDateTime,
} from "@internationalized/date";
import { DateField } from "../DateField";
import { useCallback, useMemo, useState } from "react";
import { TextField } from "../TextField";
import { Select, SelectItem } from "../Select";
import { ColorSwatchPicker, ColorSwatchPickerItem } from "../ColorSwatchPicker";
import { Button } from "../Button";
import { WorkoutCategories } from "@repo/utilities";

export type DateFormMessages = {
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  color: string;
  checkboxLabel: string;
  submit: string;
};

export type EventFormProps = {
  startDateTime: Date;
  endDateTime: Date;
  workoutCategories: { label: string; id: WorkoutCategories }[];
  onChange: (
    from: Date,
    to: Date,
    name: string,
    repeat: number,
    color: string,
  ) => void;
  messages: DateFormMessages;
};

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const repeatOptions = [
  { label: "None", id: 0 },
  { label: "Daily", id: 1 },
  { label: "Weekly", id: 2 },
  { label: "Biweekly", id: 3 },
  { label: "Monthly", id: 4 },
  { label: "Annually", id: 5 },
  { label: "Weekday", id: 6 },
];

const colorOptions = [
  "#A00",
  "#f80",
  "#080",
  "#08f",
  "#088",
  "#008",
  "#A0A",
  "#F08",
  "#AA0",
].map(parseColor);

export const DateForm = ({
  onChange,
  endDateTime,
  startDateTime,
  workoutCategories,
  messages,
}: EventFormProps) => {
  const [start, setStartDateTime] = useState<CalendarDateTime | null>(() =>
    toCalendarDateTime(fromDate(startDateTime, timeZone)),
  );
  const [end, setEndDateTime] = useState<CalendarDateTime | null>(() =>
    toCalendarDateTime(fromDate(endDateTime, timeZone)),
  );
  const [name, setName] = useState<string | undefined>(undefined);
  const [repeatItems, setRepeatItems] = useState<Key | null>(0);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(
    colorOptions[0],
  );
  const repeatSelectOptions = useMemo(
    () =>
      repeatOptions.map((option, idx) => (
        <SelectItem key={idx} id={option.id}>
          {option.label}
        </SelectItem>
      )),
    [],
  );

  const workoutOptions = useMemo(
    () =>
      workoutCategories.map((option, idx) => (
        <SelectItem key={idx} id={option.id}>
          {option.label}
        </SelectItem>
      )),
    [workoutCategories],
  );

  const colorSelectOptions = useMemo(
    () =>
      colorOptions.map((color, idx) => (
        <ColorSwatchPickerItem key={idx} color={color} />
      )),
    [],
  );

  const onSubmit = useCallback(() => {
    if (start && end && name && selectedColor)
      onChange(
        start.toDate(timeZone),
        end.toDate(timeZone),
        name,
        Number(repeatItems ?? 0),
        selectedColor.toString(),
      );
  }, [end, name, onChange, repeatItems, selectedColor, start]);

  return (
    <Form>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <Text>{messages.title}</Text>
          <TextField value={name} onChange={setName} />
        </div>
        <div>
          <Text>{messages.category}</Text>
          <Select>{workoutOptions}</Select>
        </div>
        <div>
          <Text>{messages.startDate}</Text>
          <DateField value={start} onChange={setStartDateTime} isRequired />
        </div>
        <div>
          <Text>{messages.endDate}</Text>
          <DateField value={end} onChange={setEndDateTime} isRequired />
        </div>
      </div>
      <div className="pt-4 flex flex-col gap-y-4">
        <Text>{messages.color}</Text>
        <ColorSwatchPicker value={selectedColor} onChange={setSelectedColor}>
          {colorSelectOptions}
        </ColorSwatchPicker>
        <Select
          selectionMode="single"
          value={repeatItems}
          onChange={setRepeatItems}
        >
          {repeatSelectOptions}
        </Select>
        <Button onMouseDown={onSubmit}>{messages.submit}</Button>
      </div>
    </Form>
  );
};
