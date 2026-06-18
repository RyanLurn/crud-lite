import { createTaskValidator } from "@/features/task/operations/create-task";
import { useAppForm } from "@/lib/form/hook";

export function NewTaskForm() {
  const newTaskForm = useAppForm({
    formId: "new-task-form",
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: createTaskValidator,
    },
  });
}
