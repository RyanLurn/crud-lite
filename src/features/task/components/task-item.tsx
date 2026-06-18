import type { ComponentProps } from "react";

import { ClipboardPenLine, ClipboardCheck } from "lucide-react";

import type { SelectedTask } from "@/db/schema/tables/task";
import type { StrictOmit } from "@/types/helpers";

import { ItemContent, ItemMedia, ItemTitle, Item } from "@/components/ui/item";

interface TaskItemProps extends ComponentProps<typeof Item> {
  task: StrictOmit<SelectedTask, "createdAt" | "updatedAt">;
}

export function TaskItem({
  task,
  variant = "outline",
  ...props
}: TaskItemProps) {
  return (
    <Item variant={variant} {...props}>
      <ItemMedia variant="icon">
        {task.status === "done" ? (
          <ClipboardCheck className="text-green-500" />
        ) : (
          <ClipboardPenLine />
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{task.name}</ItemTitle>
      </ItemContent>
    </Item>
  );
}
