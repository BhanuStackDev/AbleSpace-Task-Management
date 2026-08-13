"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/task";

type EditTaskModalProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
};

export default function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<TaskPriority>("medium");
  const [status, setStatus] =
    useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState("");

  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!task) {
      return;
    }

    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);

    // Convert task date into YYYY-MM-DD format
    if (task.dueDate) {
      const parsedDate = new Date(task.dueDate);

      if (!Number.isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = String(
          parsedDate.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
          parsedDate.getDate()
        ).padStart(2, "0");

        setDueDate(`${year}-${month}-${day}`);
      } else {
        setDueDate("");
      }
    } else {
      setDueDate("");
    }
  }, [task]);

  if (!isOpen || !task) {
    return null;
  }

  function openDatePicker() {
    const input = dateInputRef.current;

    if (!input) {
      return;
    }

    // Chrome / Edge support
    if (
      typeof input.showPicker === "function"
    ) {
      try {
        input.showPicker();
        return;
      } catch {
        // Browser may block showPicker.
        // Normal input click will still work.
      }
    }

    input.focus();
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!task || !title.trim()) {
      return;
    }

    const updatedTask: Task = {
      id: task.id,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
      createdAt: task.createdAt,
    };

    onSave(updatedTask);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2
              id="edit-task-title"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Edit Task
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update your task details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
            {/* Title */}
            <div>
              <label
                htmlFor="edit-task-title"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Task title
              </label>

              <input
                id="edit-task-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="edit-task-description"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Description
              </label>

              <textarea
                id="edit-task-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            {/* Priority + Status */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Priority */}
              <div>
                <label
                  htmlFor="edit-task-priority"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Priority
                </label>

                <select
                  id="edit-task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target
                        .value as TaskPriority
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                >
                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="edit-task-status"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Status
                </label>

                <select
                  id="edit-task-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as TaskStatus
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                >
                  <option value="todo">
                    To Do
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="edit-task-due-date"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Due date
              </label>

              <div
                className="relative cursor-pointer"
                onClick={openDatePicker}
              >
                <input
                  ref={dateInputRef}
                  id="edit-task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value
                    )
                  }
                  className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-11 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                />

                {/* Calendar icon */}
                <span
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-400"
                  aria-hidden="true"
                >
                  📅
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Click the date field to choose a
                due date.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}