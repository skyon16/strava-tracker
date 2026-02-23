import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { DateForm, DateFormMessages } from "./DateForm";
import { WorkoutCategories } from "@repo/utilities";

interface PopoverDateFormProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
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
  dateFormMessages: DateFormMessages;
}

export const PopoverDateForm = ({
  isOpen,
  setOpen,
  dateFormMessages,
  ...rest
}: PopoverDateFormProps) => {
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
      {/* need z index set. the schedule component has zindex for events and table. */}
      <ModalOverlay className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center z-100">
        <Modal className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl p-6 w-full max-w-2xl ">
          <Dialog className="outline-none">
            <DateForm messages={dateFormMessages} {...rest} />
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
};
