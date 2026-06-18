import {
  createTaskValidator,
  taskNameValidator,
} from "@/features/task/operations/create-task";
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
