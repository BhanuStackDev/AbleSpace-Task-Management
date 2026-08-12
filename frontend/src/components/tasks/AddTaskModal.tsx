"use client";

import { FormEvent, useState } from "react";

type Priority = "low" | "medium" | "high";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
  }) => void;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onCreate,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onCreate({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
  }

  function handleClose() {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2
              id="add-task-title"
              className="text-lg font-semibold text-slate-900"
            >
              Add Task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new task and keep your work organized.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
            <div>
              <label
                htmlFor="task-title"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Task title
              </label>

              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter task title"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="task-description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the task..."
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="task-priority"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Priority
                </label>

                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as Priority)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

           <div>
  <label
    htmlFor="task-due-date"
    className="mb-2 block text-sm font-medium text-slate-700"
  >
    Due date
  </label>

  <div className="relative">
    <input
      id="task-due-date"
      type="date"
      value={dueDate}
      onChange={(event) => setDueDate(event.target.value)}
      onClick={(event) => {
        const input = event.currentTarget;

        if ("showPicker" in input) {
          input.showPicker();
        }
      }}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-11 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
    />

    <button
      type="button"
      onClick={() => {
        const input = document.getElementById(
          "task-due-date"
        ) as HTMLInputElement | null;

        if (input && "showPicker" in input) {
          input.showPicker();
        }
      }}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
      aria-label="Open calendar"
    >
      📅
    </button>
  </div>
</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}