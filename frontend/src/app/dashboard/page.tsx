"use client";

import { useEffect, useMemo, useState } from "react";
import type { Task } from "@/types/task";

const STORAGE_KEY = "ablespace-tasks";

function parseTaskDate(dateString: string) {
  if (!dateString) {
    return null;
  }

  const parsed = new Date(dateString);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);

  return parsed;
}

function getDaysDifference(dueDate: string) {
  const date = parseTaskDate(dueDate);

  if (!date) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.round(
    (date.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function getDeadlineText(task: Task) {
  if (task.status === "completed") {
    return "✓ Completed";
  }

  const days = getDaysDifference(task.dueDate);

  if (days === null) {
    return "No deadline";
  }

  if (days < 0) {
    const overdueDays = Math.abs(days);

    return `⚠ Overdue by ${overdueDays} ${
      overdueDays === 1 ? "day" : "days"
    }`;
  }

  if (days === 0) {
    return "🔴 Due today · 0 days left";
  }

  if (days === 1) {
    return "Due tomorrow · 1 day left";
  }

  return `${days} days left to submit`;
}

function getDeadlineClass(task: Task) {
  if (task.status === "completed") {
    return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300";
  }

  const days = getDaysDifference(task.dueDate);

  if (days === null) {
    return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }

  if (days < 0) {
    return "border-red-300 bg-red-100 text-red-900 dark:border-red-900/70 dark:bg-red-950/70 dark:text-red-300";
  }

  if (days === 0 || days === 1) {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300";
  }

  if (days <= 4) {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300";
  }

  return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300";
}

function formatDate(dateString: string) {
  const date = parseTaskDate(dateString);

  if (!date) {
    return "No date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function loadTasks() {
      try {
        const savedTasks =
          localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
          setTasks([]);
          setIsLoaded(true);
          return;
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard tasks:",
          error
        );

        setTasks([]);
      } finally {
        setIsLoaded(true);
      }
    }

    loadTasks();

    window.addEventListener(
      "storage",
      loadTasks
    );

    const interval = window.setInterval(
      loadTasks,
      1000
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadTasks
      );

      window.clearInterval(interval);
    };
  }, []);

  const statistics = useMemo(() => {
    const total = tasks.length;

    const todo = tasks.filter(
      (task) => task.status === "todo"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "in-progress"
    ).length;

    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const dueToday = tasks.filter(
      (task) =>
        task.status !== "completed" &&
        getDaysDifference(task.dueDate) === 0
    ).length;

    const overdue = tasks.filter(
      (task) =>
        task.status !== "completed" &&
        (getDaysDifference(task.dueDate) ?? 0) < 0
    ).length;

    const progress =
      total === 0
        ? 0
        : Math.round((completed / total) * 100);

    return {
      total,
      todo,
      inProgress,
      completed,
      dueToday,
      overdue,
      progress,
    };
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => {
        if (task.status === "completed") {
          return false;
        }

        const days = getDaysDifference(
          task.dueDate
        );

        return days !== null && days >= 0;
      })
      .sort((a, b) => {
        const dateA =
          getDaysDifference(a.dueDate) ?? 99999;

        const dateB =
          getDaysDifference(b.dueDate) ?? 99999;

        return dateA - dateB;
      })
      .slice(0, 5);
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        const dateA = new Date(
          a.createdAt
        ).getTime();

        const dateB = new Date(
          b.createdAt
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [tasks]);

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome to your AbleSpace dashboard.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Tasks
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {statistics.total}
            </p>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              All your tasks
            </p>
          </div>

          {/* To Do */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              To Do
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {statistics.todo}
            </p>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Tasks waiting to start
            </p>
          </div>

          {/* In Progress */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {statistics.inProgress}
            </p>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Currently being worked on
            </p>
          </div>

          {/* Completed */}
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900/60 dark:bg-green-950/30">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800 dark:text-green-200">
              {statistics.completed}
            </p>

            <p className="mt-2 text-xs text-green-700 dark:text-green-300">
              Successfully completed
            </p>
          </div>
        </div>

        {/* Alerts */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">

          {/* Due Today */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/60 dark:bg-red-950/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                  🔴 Due Today
                </p>

                <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                  Tasks that need attention today.
                </p>
              </div>

              <span className="text-3xl font-bold text-red-800 dark:text-red-300">
                {statistics.dueToday}
              </span>
            </div>
          </div>

          {/* Overdue */}
          <div className="rounded-xl border border-red-300 bg-red-100 p-5 dark:border-red-900/70 dark:bg-red-950/60">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-red-900 dark:text-red-300">
                  🟥 ⚠ Overdue
                </p>

                <p className="mt-1 text-xs font-medium text-red-800 dark:text-red-400">
                  Tasks whose deadlines have passed.
                </p>
              </div>

              <span className="text-3xl font-bold text-red-900 dark:text-red-300">
                {statistics.overdue}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Overall Progress
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your completed tasks compared with total tasks.
              </p>
            </div>

            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {statistics.progress}%
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{
                width: `${statistics.progress}%`,
              }}
            />
          </div>
        </section>

        {/* Upcoming Tasks */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Upcoming Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Tasks with the nearest deadlines.
              </p>
            </div>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No upcoming tasks.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-lg border p-4 ${getDeadlineClass(
                    task
                  )}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-xs opacity-80">
                        Due: {formatDate(task.dueDate)}
                      </p>
                    </div>

                    <div className="shrink-0 text-xs font-bold">
                      {getDeadlineText(task)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Tasks */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your recently created tasks.
            </p>
          </div>

          {recentTasks.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No tasks yet.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                      {task.status === "completed"
                        ? "✓ "
                        : ""}
                      {task.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Created: {formatDate(task.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                        : task.status === "in-progress"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {task.status === "in-progress"
                      ? "In Progress"
                      : task.status === "completed"
                        ? "Completed"
                        : "To Do"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}