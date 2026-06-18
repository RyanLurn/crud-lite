import { createFileRoute } from "@tanstack/react-router";

import { NewTaskForm } from "@/features/task/components/new-task-form";
import { listTasks } from "@/features/task/operations/list-tasks";
import { TaskList } from "@/features/task/components/task-list";

export const Route = createFileRoute("/")({
  loader: () => listTasks(),
  component: HomePage,
});

function HomePage() {
  const listTasksResult = Route.useLoaderData();

  if (!listTasksResult.success) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-3">
        <h1 className="text-lg text-destructive">
          500 - Internal server error
        </h1>
        <p>{listTasksResult.error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col gap-y-5">
      <h1 className="mt-5 text-center text-4xl font-bold">Todo list</h1>
      <NewTaskForm className="w-full" />
      {listTasksResult.data.length > 0 ? (
        <TaskList tasks={listTasksResult.data} />
      ) : (
        <p>Your list is empty.</p>
      )}
    </div>
  );
}
