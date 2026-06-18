import { toast } from "sonner";

import {
  createTaskValidator,
  taskNameValidator,
  createTask,
} from "@/features/task/operations/create-task";
import { useAppForm } from "@/lib/form/hook";
import { cn } from "@/lib/cn";

export function NewTaskForm({ className }: { className?: string }) {
  const newTaskForm = useAppForm({
    formId: "new-task-form",
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: createTaskValidator,
    },
    onSubmit: async ({ value }) => {
      const data = createTaskValidator.parse(value);

      try {
        const createTaskResult = await createTask({ data });
        if (!createTaskResult.success) {
          toast.error(createTaskResult.error.message);
          return;
        }
        toast.success(`The ${data.name} task has been added!`);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error(error);
        }
        toast.error(`Failed to add ${data.name} task.`);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void newTaskForm.handleSubmit();
      }}
      className={cn("flex gap-x-2", className)}
      id={newTaskForm.formId}
    >
      <newTaskForm.AppField
        validators={{
          onChange: taskNameValidator,
        }}
        name="name"
      >
        {(appField) => <appField.TextField placeholder="Add a new task" />}
      </newTaskForm.AppField>
      <newTaskForm.AppForm>
        <newTaskForm.SubmitButton submittingText="Adding..." submitText="Add" />
      </newTaskForm.AppForm>
    </form>
  );
}
