import { createFileRoute } from "@tanstack/react-router";

import { listTasks } from "@/features/task/operations/list-tasks";
import { TaskList } from "@/features/task/components/list";

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
    <div className="flex h-full flex-col items-center justify-center gap-y-3">
      <TaskList tasks={listTasksResult.data} />
    </div>
  );
}
