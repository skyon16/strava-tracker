import { Dialog, Modal, ModalOverlay } from "react-aria-components";
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
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={setOpen}
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center"
    >
      <Modal className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl p-6 w-full max-w-2xl">
        <Dialog className="outline-none">
          <DateForm messages={dateFormMessages} {...rest} />
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
