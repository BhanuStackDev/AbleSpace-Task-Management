"use client";

import { useEffect, useRef, useState } from "react";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/task";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onPriorityChange: (
    taskId: string,
    priority: TaskPriority
  ) => void;
  onView: (task: Task) => void;
};

const priorityStyles = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  medium:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  high:
    "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

function getDeadlineInfo(dueDate: string) {
  if (!dueDate) {
    return null;
  }

  const parsedDate = new Date(dueDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  parsedDate.setHours(0, 0, 0, 0);

  const difference =
    parsedDate.getTime() - today.getTime();

  const daysLeft = Math.round(
    difference / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return {
      type: "overdue" as const,
      days: Math.abs(daysLeft),
    };
  }

  if (daysLeft === 0) {
    return {
      type: "today" as const,
      days: 0,
    };
  }

  if (daysLeft === 1) {
    return {
      type: "tomorrow" as const,
      days: 1,
    };
  }

  if (daysLeft <= 4) {
    return {
      type: "warning" as const,
      days: daysLeft,
    };
  }

  return {
    type: "normal" as const,
    days: daysLeft,
  };
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
  onView,
}: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  function handleEdit() {
    setIsMenuOpen(false);
    onEdit(task);
  }

  function handleDelete() {
    setIsMenuOpen(false);
    onDelete(task.id);
  }

  function handleView() {
    onView(task);
  }

  const deadlineInfo =
    task.status === "completed"
      ? null
      : getDeadlineInfo(task.dueDate);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {task.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {task.description}
          </p>
        </div>

        {/* Action Menu */}
        <div
          ref={menuRef}
          className="relative shrink-0"
        >
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(
                (current) => !current
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label={`Actions for ${task.title}`}
            aria-expanded={isMenuOpen}
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={handleEdit}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Edit task
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Priority + Status */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <select
          value={task.priority}
          onChange={(event) =>
            onPriorityChange(
              task.id,
              event.target.value as TaskPriority
            )
          }
          className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none ${priorityStyles[task.priority]}`}
          aria-label="Change priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={task.status}
          onChange={(event) =>
            onStatusChange(
              task.id,
              event.target.value as TaskStatus
            )
          }
          className="cursor-pointer rounded-full border-0 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 outline-none dark:bg-slate-800 dark:text-slate-300"
          aria-label="Change status"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">
            In Progress
          </option>
          <option value="completed">
            Completed
          </option>
        </select>
      </div>

      {/* Deadline Status */}
      <div className="mt-5">
        {task.status === "completed" ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              ✓
            </span>

            <span>
              Task completed successfully
            </span>
          </div>
        ) : deadlineInfo?.type === "overdue" ? (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-100 px-3 py-2.5 text-sm font-bold text-red-900 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-300">
            <span className="text-base">⚠</span>

            <span>
              Overdue by {deadlineInfo.days}{" "}
              {deadlineInfo.days === 1
                ? "day"
                : "days"}
            </span>
          </div>
        ) : deadlineInfo?.type === "today" ? (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
            <span>⚠</span>

            <span>
              Due today · 0 days left
            </span>
          </div>
        ) : deadlineInfo?.type === "tomorrow" ? (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
            <span>●</span>

            <span>
              Due tomorrow · 1 day left
            </span>
          </div>
        ) : deadlineInfo?.type === "warning" ? (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <span>●</span>

            <span>
              {deadlineInfo.days} days left to submit
            </span>
          </div>
        ) : deadlineInfo?.type === "normal" ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
            <span>●</span>

            <span>
              {deadlineInfo.days} days left to submit
            </span>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-xs text-slate-400">
          Due {task.dueDate}
        </span>

        <button
          type="button"
          onClick={handleView}
          className="text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          View task
        </button>
      </div>
    </article>
  );
}

