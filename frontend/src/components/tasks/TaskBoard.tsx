
"use client";

import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
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

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design dashboard",
    description:
      "Create the main dashboard interface based on the product requirements.",
    status: "todo",
    priority: "high",
    dueDate: "Aug 12, 2026",
    createdAt: "Aug 8, 2026",
  },
  {
    id: "2",
    title: "Review task requirements",
    description:
      "Review the task management requirements and prepare the implementation plan.",
    status: "in-progress",
    priority: "medium",
    dueDate: "Aug 10, 2026",
    createdAt: "Aug 8, 2026",
  },
  {
    id: "3",
    title: "Set up project",
    description:
      "Initialize the project structure and configure the development environment.",
    status: "completed",
    priority: "low",
    dueDate: "Aug 8, 2026",
    createdAt: "Aug 8, 2026",
  },
];

const STORAGE_KEY = "ablespace-tasks";


function notifyTasksUpdated() {
  window.dispatchEvent(
    new CustomEvent("ablespace-tasks-updated")
  );
}

function formatDate(dateString: string) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type TaskBoardProps = {
  searchQuery: string;
};

export default function TaskBoard({
  searchQuery,
}: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      const savedTasks = localStorage.getItem(STORAGE_KEY);

      if (savedTasks) {
        try {
          const localTasks = JSON.parse(savedTasks);
          if (Array.isArray(localTasks)) {
            setTasks(localTasks);
            setIsLoaded(true);
            return;
          }
        } catch (error) {
          console.warn("Stored task data is invalid; loading from API.", error);
        }
      }

      try {
        const apiTasks = await getTasks();
        if (active) {
          const nextTasks = apiTasks.map(apiTaskToUiTask);
          setTasks(nextTasks);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
        }
      } catch (error) {
        console.warn("Task API unavailable; using seed data.", error);
        setTasks(initialTasks);
      } finally {
        if (active) setIsLoaded(true);
      }
    }

    loadTasks();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    notifyTasksUpdated();
  }, [tasks, isLoaded]);


  async function handleCreateTask(taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
  }) {
    try {
      const created = await createTask(taskData);
      setTasks((currentTasks) => [apiTaskToUiTask(created), ...currentTasks]);
    } catch (error) {
      console.warn("Create API unavailable; saving locally.", error);
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: taskData.title,
        description: taskData.description,
        status: "todo",
        priority: taskData.priority,
        dueDate: formatDate(taskData.dueDate),
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      setTasks((currentTasks) => [newTask, ...currentTasks]);
    }
    setIsModalOpen(false);
  }

  async function handleDeleteTask(taskId: string) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.warn("Delete API unavailable; deleting locally.", error);
    }
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    try { await updateTask(taskId, { status }); } catch (error) { console.warn("Status API update failed; keeping local state.", error); }
    setTasks((currentTasks) => currentTasks.map((task) => task.id === taskId ? { ...task, status } : task));
  }

  async function handlePriorityChange(taskId: string, priority: TaskPriority) {
    try { await updateTask(taskId, { priority }); } catch (error) { console.warn("Priority API update failed; keeping local state.", error); }
    setTasks((currentTasks) => currentTasks.map((task) => task.id === taskId ? { ...task, priority } : task));
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);
    setIsEditModalOpen(true);
  }

  async function handleSaveEditedTask(updatedTask: Task) {
    try {
      const saved = await updateTask(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
        dueDate: updatedTask.dueDate,
      });
      updatedTask = apiTaskToUiTask(saved);
    } catch (error) {
      console.warn("Edit API unavailable; saving locally.", error);
    }
    setTasks((currentTasks) => currentTasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
    setIsEditModalOpen(false);
    setEditingTask(null);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setEditingTask(null);
  }

  function handleViewTask(task: Task) {
    setViewingTask(task);
    setIsViewModalOpen(true);
  }

  function handleCloseViewModal() {
    setIsViewModalOpen(false);
    setViewingTask(null);
  }

  const normalizedSearch =
    searchQuery.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    if (!normalizedSearch) {
      return true;
    }

    return (
      task.title
        .toLowerCase()
        .includes(normalizedSearch) ||
      task.description
        .toLowerCase()
        .includes(normalizedSearch)
    );
  });

  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return (
    <section className="mt-6">
      {/* Statistics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Tasks
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {totalTasks}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            To Do
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {todoTasks}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            In Progress
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {inProgressTasks}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Completed
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {completedTasks}
          </p>
        </div>
      </div>

      {/* Task heading */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Tasks
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your tasks and track their progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          + Add Task
        </button>
      </div>

      {/* Task cards */}
      {filteredTasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onView={handleViewTask}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-600 dark:bg-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {searchQuery.trim()
              ? "No tasks found"
              : "No tasks yet"}
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {searchQuery.trim()
              ? "Try searching with a different keyword."
              : "Create your first task to get started."}
          </p>
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        task={editingTask}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditedTask}
      />

      {/* View Task Modal */}
      <ViewTaskModal
        isOpen={isViewModalOpen}
        task={viewingTask}
        onClose={handleCloseViewModal}
      />
    </section>
  );
}
