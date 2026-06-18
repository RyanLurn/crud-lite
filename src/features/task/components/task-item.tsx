import { ClipboardPenLine, ClipboardCheck } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import type { SelectedTask } from "@/db/schema/tables/task";
import type { StrictOmit } from "@/types/helpers";

import { updateTaskStatus } from "@/features/task/operations/update-task-status";
import { ItemContent, ItemMedia, ItemTitle, Item } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";

interface TaskItemProps extends StrictOmit<
  ComponentProps<typeof Item>,
  "onClick"
> {
  task: SelectedTask;
}

export function TaskItem({
  task,
  className,
  variant = "outline",
  ...props
}: TaskItemProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  async function toggleStatus() {
    setIsToggling(true);
    const newStatus = task.status === "planned" ? "done" : "planned";
    try {
      const result = await updateTaskStatus({
        data: {
          id: task.id,
          status: newStatus,
        },
      });
      if (!result.success) {
        toast.error(result.error.message);
      } else {
        await router.invalidate({ sync: true });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
      toast.error(
        `Something went wrong while trying to mark ${task.name} as ${newStatus}.`
      );
    }
    setIsToggling(false);
  }

  return (
    <Item
      className={cn(
        isToggling
          ? "cursor-progress text-muted-foreground"
          : "cursor-pointer hover:bg-muted",
        className
      )}
      onClick={() => void toggleStatus()}
      variant={variant}
      {...props}
    >
      <ItemMedia variant="icon">
        {isToggling ? (
          <Spinner />
        ) : task.status === "done" ? (
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
