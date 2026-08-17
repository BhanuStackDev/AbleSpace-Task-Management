"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import ViewTaskModal from "./ViewTaskModal";

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/task";

import {
  apiTaskToUiTask,
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/lib/tasks-api";

const STORAGE_KEY = "ablespace-tasks";

type TaskBoardProps = {
  searchQuery: string;
};

const statusGroups: Array<{
  status: TaskStatus;
  label: string;
}> = [
  {
    status: "todo",
    label: "To Do",
  },
  {
    status: "in-progress",
    label: "Doing",
  },
  {
    status: "completed",
    label: "Completed",
  },
];

const priorityStyles: Record<TaskPriority, string> = {
  high: "text-red-600 dark:text-red-400",
  medium: "text-amber-600 dark:text-amber-400",
  low: "text-slate-500 dark:text-slate-400",
};

const priorityDot: Record<TaskPriority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-slate-400",
};

function formatDate(dateString: string) {
  if (!dateString) {
    return "—";
  }

  const isoLike = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ? `${dateString}T00:00:00`
    : dateString;

  const date = new Date(isoLike);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function notifyTasksUpdated() {
  window.dispatchEvent(
    new CustomEvent("ablespace-tasks-updated"),
  );
}

function getCachedTasks(): Task[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(
      STORAGE_KEY,
    );

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

function MemberAvatars() {
  return (
    <div
      className="flex items-center -space-x-2"
      aria-label="Task members"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[10px] font-semibold text-white dark:border-slate-900">
        G
      </span>

      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-semibold text-slate-600 dark:border-slate-900 dark:bg-slate-700 dark:text-slate-200">
        +
      </span>
    </div>
  );
}

export default function TaskBoard({
  searchQuery,
}: TaskBoardProps) {
  /*
   * Start with an empty array for SSR.
   *
   * On the browser, useLayoutEffect restores the cached tasks
   * before the browser paints the updated UI.
   *
   * This prevents:
   *
   * Build Dashboard UI
   * -> disappears
   * -> API loads
   * -> Build Dashboard UI appears again
   */

  const [tasks, setTasks] = useState<Task[]>([]);

  const [isHydrated, setIsHydrated] =
    useState(false);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] =
    useState(false);

  const [viewingTask, setViewingTask] =
    useState<Task | null>(null);

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  /*
   * RESTORE LOCAL CACHE BEFORE PAINT
   */
  useLayoutEffect(() => {
    const cachedTasks = getCachedTasks();

    if (cachedTasks.length > 0) {
      setTasks(cachedTasks);
    }

    setIsHydrated(true);
  }, []);

  /*
   * AFTER CACHE IS RESTORED,
   * FETCH THE REAL DATA FROM BACKEND.
   */
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    let active = true;

    async function loadTasks() {
      try {
        const apiTasks = await getTasks();

        if (!active) {
          return;
        }

        const latestTasks =
          apiTasks.map(apiTaskToUiTask);

        setTasks(latestTasks);

        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(latestTasks),
        );

        notifyTasksUpdated();
      } catch (error) {
        /*
         * If API fails, DON'T clear the existing UI.
         * Cached tasks remain visible.
         */
        console.error(
          "Failed to load tasks from API:",
          error,
        );
      }
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, [isHydrated]);

  /*
   * KEEP LOCAL STORAGE IN SYNC
   */
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks),
    );

    notifyTasksUpdated();
  }, [tasks, isHydrated]);

  /*
   * CREATE TASK
   */
  async function handleCreateTask(taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
  }) {
    try {
      const created =
        await createTask(taskData);

      const newTask =
        apiTaskToUiTask(created);

      setTasks((current) => [
        newTask,
        ...current,
      ]);
    } catch (error) {
      console.error(
        "Failed to create task:",
        error,
      );

      /*
       * Local fallback.
       */
      const fallback: Task = {
        id: crypto.randomUUID(),
        title: taskData.title,
        description: taskData.description,
        status: "todo",
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        createdAt: new Date()
          .toISOString()
          .slice(0, 10),
      };

      setTasks((current) => [
        fallback,
        ...current,
      ]);
    }

    setIsModalOpen(false);
  }

  /*
   * DELETE TASK
   */
  async function handleDeleteTask(
    taskId: string,
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error(
        "Failed to delete task from API:",
        error,
      );
    }

    setTasks((current) =>
      current.filter(
        (task) => task.id !== taskId,
      ),
    );

    setOpenMenu(null);
  }

  /*
   * CHANGE STATUS
   */
  async function handleStatusChange(
    taskId: string,
    status: TaskStatus,
  ) {
    try {
      await updateTask(taskId, {
        status,
      });
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error,
      );
    }

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task,
      ),
    );
  }

  /*
   * CHANGE PRIORITY
   */
  async function handlePriorityChange(
    taskId: string,
    priority: TaskPriority,
  ) {
    try {
      await updateTask(taskId, {
        priority,
      });
    } catch (error) {
      console.error(
        "Failed to update task priority:",
        error,
      );
    }

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              priority,
            }
          : task,
      ),
    );
  }

  /*
   * OPEN EDIT
   */
  function handleEditTask(task: Task) {
    setOpenMenu(null);
    setEditingTask(task);
    setIsEditModalOpen(true);
  }

  /*
   * SAVE EDIT
   */
  async function handleSaveEditedTask(
    updatedTask: Task,
  ) {
    try {
      const saved =
        await updateTask(
          updatedTask.id,
          {
            title: updatedTask.title,
            description:
              updatedTask.description,
            status: updatedTask.status,
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate,
          },
        );

      const apiUpdatedTask =
        apiTaskToUiTask(saved);

      setTasks((current) =>
        current.map((task) =>
          task.id === apiUpdatedTask.id
            ? apiUpdatedTask
            : task,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to update task:",
        error,
      );

      setTasks((current) =>
        current.map((task) =>
          task.id === updatedTask.id
            ? updatedTask
            : task,
        ),
      );
    }

    setIsEditModalOpen(false);
    setEditingTask(null);
  }

  /*
   * SEARCH
   */
  const normalizedSearch =
    searchQuery.trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        !normalizedSearch ||
        task.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        task.description
          .toLowerCase()
          .includes(normalizedSearch),
    );
  }, [
    tasks,
    normalizedSearch,
  ]);

  /*
   * COUNTS
   */
  const counts = {
    total: tasks.length,

    todo: tasks.filter(
      (task) => task.status === "todo",
    ).length,

    doing: tasks.filter(
      (task) =>
        task.status === "in-progress",
    ).length,

    completed: tasks.filter(
      (task) =>
        task.status === "completed",
    ).length,
  };

  /*
   * Before hydration, keep the existing page
   * structure stable without showing an incorrect
   * task list.
   */
  if (!isHydrated) {
    return (
      <section className="mt-2">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Tasks
              </h2>

              <span className="h-5 w-7 rounded-md bg-slate-100 dark:bg-slate-800" />
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Organize work by status, priority and due date.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-20 rounded-md bg-slate-100 dark:bg-slate-800" />
            <div className="h-9 w-28 rounded-md bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="h-12 animate-pulse bg-slate-50 dark:bg-slate-800/60" />
              <div className="h-16 animate-pulse border-t border-slate-100 dark:border-slate-800" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-2">
      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Tasks
            </h2>

            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {counts.total}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Organize work by status, priority and due date.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <span aria-hidden="true">
              ▦
            </span>
            Fields
          </button>

          <button
            type="button"
            onClick={() =>
              setIsModalOpen(true)
            }
            className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-950"
          >
            <span aria-hidden="true">
              +
            </span>
            Add Task
          </button>
        </div>
      </div>

      {/* GROUPS */}
      <div className="space-y-6">
        {statusGroups.map((group) => {
          const groupTasks =
            filteredTasks.filter(
              (task) =>
                task.status ===
                group.status,
            );

          return (
            <section
              key={group.status}
              aria-labelledby={`group-${group.status}`}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <h3
                  id={`group-${group.status}`}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span
                    aria-hidden="true"
                    className="text-xs text-slate-400"
                  >
                    ⌄
                  </span>

                  {group.label}

                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {groupTasks.length}
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <table className="min-w-180 w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                      <th className="px-4 py-3 font-medium">
                        Task
                      </th>

                      <th className="w-32 px-4 py-3 font-medium">
                        Priority
                      </th>

                      <th className="w-28 px-4 py-3 font-medium">
                        Members
                      </th>

                      <th className="w-36 px-4 py-3 font-medium">
                        Due Date
                      </th>

                      <th className="w-24 px-4 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {groupTasks.map(
                      (task) => (
                        <tr
                          key={task.id}
                          className="group border-b border-slate-100 last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/50"
                        >
                          <td className="px-4 py-3.5">
                            <button
                              type="button"
                              onClick={() => {
                                setViewingTask(
                                  task,
                                );
                                setIsViewModalOpen(
                                  true,
                                );
                              }}
                              className="max-w-90 truncate text-left font-medium text-slate-800 hover:underline dark:text-slate-100"
                            >
                              {task.title}
                            </button>
                          </td>

                          <td className="px-4 py-3.5">
                            <label
                              className={`inline-flex items-center gap-1.5 text-xs font-medium ${priorityStyles[task.priority]}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${priorityDot[task.priority]}`}
                              />

                              <select
                                value={
                                  task.priority
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handlePriorityChange(
                                    task.id,
                                    event.target
                                      .value as TaskPriority,
                                  )
                                }
                                className="cursor-pointer appearance-none bg-transparent outline-none"
                                aria-label={`Priority for ${task.title}`}
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
                            </label>
                          </td>

                          <td className="px-4 py-3.5">
                            <MemberAvatars />
                          </td>

                          <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                            {formatDate(
                              task.dueDate,
                            )}
                          </td>

                          <td className="relative px-4 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    task.id
                                    ? null
                                    : task.id,
                                )
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                              aria-label={`Actions for ${task.title}`}
                              aria-expanded={
                                openMenu ===
                                task.id
                              }
                            >
                              ⋯
                            </button>

                            {openMenu ===
                              task.id && (
                              <div className="absolute right-3 top-12 z-30 w-36 rounded-lg border border-slate-200 bg-white p-1 text-left shadow-lg dark:border-slate-700 dark:bg-slate-900">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setViewingTask(
                                      task,
                                    );
                                    setIsViewModalOpen(
                                      true,
                                    );
                                    setOpenMenu(
                                      null,
                                    );
                                  }}
                                  className="w-full rounded-md px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                  Open
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditTask(
                                      task,
                                    )
                                  }
                                  className="w-full rounded-md px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteTask(
                                      task.id,
                                    )
                                  }
                                  className="w-full rounded-md px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ),
                    )}

                    {groupTasks.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-7 text-center text-xs text-slate-400"
                        >
                          {searchQuery.trim()
                            ? "No matching tasks in this section."
                            : "No tasks in this section."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(true)
                  }
                  className="w-full border-t border-slate-100 px-4 py-2.5 text-left text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  + Add Task
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {/* ADD */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        onCreate={handleCreateTask}
      />

      {/* EDIT */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        task={editingTask}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveEditedTask}
      />

      {/* VIEW */}
      <ViewTaskModal
        isOpen={isViewModalOpen}
        task={viewingTask}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingTask(null);
        }}
      />
    </section>
  );
}