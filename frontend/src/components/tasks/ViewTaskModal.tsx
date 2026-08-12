"use client";

import type { Task } from "@/types/task";

type ViewTaskModalProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
};

const priorityStyles = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

const statusStyles = {
  todo: "bg-slate-100 text-slate-600",
  "in-progress": "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
};

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  completed: "Completed",
};

export default function ViewTaskModal({
  task,
  isOpen,
  onClose,
}: ViewTaskModalProps) {
  if (!isOpen || !task) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-task-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="min-w-0 pr-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Task details
            </p>

            <h2
              id="view-task-title"
              className="mt-1 wrap-break-word text-xl font-semibold text-slate-900"
            >
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-6 py-6">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Description
            </p>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {task.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Priority
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${priorityStyles[task.priority]}`}
              >
                {task.priority.charAt(0).toUpperCase() +
                  task.priority.slice(1)}
              </span>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Status
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${statusStyles[task.status]}`}
              >
                {statusLabels[task.status]}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Due date
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {task.dueDate || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Created
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {task.createdAt || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}