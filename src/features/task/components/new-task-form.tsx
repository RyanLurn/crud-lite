import { useRouter } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-form";
import { toast } from "sonner";

import {
  createTaskValidator,
  createTask,
} from "@/features/task/operations/create-task";
import { formatErrorMessage } from "@/utils/format-error-message";
import { useAppForm } from "@/lib/form/hook";
import { cn } from "@/lib/cn";

export function NewTaskForm({ className }: { className?: string }) {
  const router = useRouter();

  const newTaskForm = useAppForm({
    formId: "new-task-form",
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: createTaskValidator,
    },
    onSubmit: async ({ value, formApi }) => {
      const data = createTaskValidator.parse(value);

      try {
        const createTaskResult = await createTask({ data });
        if (!createTaskResult.success) {
          toast.error(createTaskResult.error.message);
          return;
        }
        toast.success(`"${data.name}" has been added to your task list!`);
        formApi.resetField("name");
        await router.invalidate({ sync: true });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error(error);
        }
        toast.error(
          formatErrorMessage({
            action: "add task",
            reason: "an unexpected error",
          })
        );
      }
    },
  });

  const isSubmitting = useStore(
    newTaskForm.store,
    (state) => state.isSubmitting
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void newTaskForm.handleSubmit();
      }}
      className={cn("flex gap-x-2", className)}
      id={newTaskForm.formId}
    >
      <newTaskForm.AppField name="name">
        {(appField) => (
          <appField.TextField
            placeholder="Add a new task"
            disabled={isSubmitting}
          />
        )}
      </newTaskForm.AppField>
      <newTaskForm.AppForm>
        <newTaskForm.SubmitButton
          submittingText="Adding..."
          className="w-1/5"
          submitText="Add"
        />
      </newTaskForm.AppForm>
    </form>
  );
}
