import type { ComponentProps } from "react";

import type { SelectedTask } from "@/db/schema/tables/task";
import type { StrictOmit } from "@/types/helpers";

import { TaskItem } from "@/features/task/components/task-item";
import { ItemGroup } from "@/components/ui/item";

interface TaskListProps extends ComponentProps<typeof ItemGroup> {
  tasks: StrictOmit<SelectedTask, "createdAt" | "updatedAt">[];
}

export function TaskList({ tasks, ...props }: TaskListProps) {
  return (
    <ItemGroup {...props}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ItemGroup>
  );
}
