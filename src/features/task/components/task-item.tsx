import type { ComponentProps } from "react";

import { ClipboardPenLine, ClipboardCheck } from "lucide-react";

import type { SelectedTask } from "@/db/schema/tables/task";

import { ItemContent, ItemMedia, ItemTitle, Item } from "@/components/ui/item";
import { cn } from "@/lib/cn";

interface TaskItemProps extends ComponentProps<typeof Item> {
  task: SelectedTask;
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
        <ItemTitle
          className={cn(
            task.status === "done" ? "text-muted-foreground line-through" : ""
          )}
        >
          {task.name}
        </ItemTitle>
      </ItemContent>
    </Item>
  );
}
