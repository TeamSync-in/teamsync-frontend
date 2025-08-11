import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { EditTaskForm } from "./edit-task-form";
import { TaskType } from "@/types/api.type";
import { updateTaskMutationFn, getMembersInWorkspaceQueryFn } from "@/lib/api";
import useWorkspaceId from "@/hooks/use-workspace-id";

interface EditTaskDialogProps {
  task: TaskType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type EditTaskFormValues = {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  assignedTo?: string;
  dueDate?: Date;
};

export function EditTaskDialog({
  task,
  isOpen,
  onOpenChange,
}: EditTaskDialogProps) {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  // Fetch workspace members for assignee dropdown
  const { data: membersData } = useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => getMembersInWorkspaceQueryFn(workspaceId),
    enabled: isOpen && !!workspaceId,
  });

  const { mutate: updateTask, isPending } = useMutation({
    mutationFn: updateTaskMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["all-tasks", workspaceId],
      });
      toast({
        title: "Success",
        description: data.message || "Task updated successfully",
        variant: "success",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: EditTaskFormValues) => {
    if (!task.project?._id) {
      toast({
        title: "Error",
        description: "Project ID not found for this task",
        variant: "destructive",
      });
      return;
    }

    const updateData = {
      workspaceId,
      projectId: task.project._id,
      taskId: task._id,
      data: {
        title: data.title,
        description: data.description || "",
        priority: data.priority,
        status: data.status,
        assignedTo:
          data.assignedTo === "unassigned" ? undefined : data.assignedTo,
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
      },
    };

    updateTask(updateData);
  };

  // Transform members data to match the expected format
  const members =
    membersData?.members.map(
      (member: { userId: { _id: string; name: string } }) => ({
        _id: member.userId._id,
        name: member.userId.name,
      })
    ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the task details below. Click update when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditTaskForm
          task={task}
          onSubmit={handleSubmit}
          isLoading={isPending}
          members={members}
        />
      </DialogContent>
    </Dialog>
  );
}
