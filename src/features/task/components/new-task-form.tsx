import { createTaskValidator } from "@/features/task/operations/create-task";
import { useAppForm } from "@/lib/form/hook";

export function NewTaskForm({ className }: { className?: string }) {
  const newTaskForm = useAppForm({
    formId: "new-task-form",
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: createTaskValidator,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void newTaskForm.handleSubmit();
      }}
      id={newTaskForm.formId}
      className={className}
    ></form>
  );
}
