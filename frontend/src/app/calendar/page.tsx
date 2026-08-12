"use client";

import { useEffect, useMemo, useState } from "react";
import type { Task } from "@/types/task";

const STORAGE_KEY = "ablespace-tasks";

const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function parseTaskDate(dateString: string) {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDeadlineInfo(dueDate: string) {
  const parsedDate = parseTaskDate(dueDate);

  if (!parsedDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

function getTaskStatusClass(task: Task) {
  if (task.status === "completed") {
    return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/50 dark:text-green-300";
  }

  const deadline = getDeadlineInfo(task.dueDate);

  if (!deadline) {
    return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }

  if (deadline.type === "overdue") {
    return "border-red-300 bg-red-100 text-red-900 dark:border-red-900/70 dark:bg-red-950/70 dark:text-red-300";
  }

  if (
    deadline.type === "today" ||
    deadline.type === "tomorrow"
  ) {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300";
  }

  if (deadline.type === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300";
  }

  return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300";
}

function getDeadlineMessage(task: Task) {
  if (task.status === "completed") {
    return "✓ Task completed successfully";
  }

  const deadline = getDeadlineInfo(task.dueDate);

  if (!deadline) {
    return "No deadline information";
  }

  if (deadline.type === "overdue") {
    return `⚠ Overdue by ${deadline.days} ${
      deadline.days === 1 ? "day" : "days"
    }`;
  }

  if (deadline.type === "today") {
    return "⚠ Due today · 0 days left";
  }

  if (deadline.type === "tomorrow") {
    return "Due tomorrow · 1 day left";
  }

  return `${deadline.days} days left to submit`;
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(
    new Date()
  );
  const [selectedDateKey, setSelectedDateKey] =
    useState<string | null>(null);


useEffect(() => {
  function loadTasks() {
    try {
      const savedTasks =
        localStorage.getItem(STORAGE_KEY);

      if (!savedTasks) {
        setTasks([]);
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
        "Failed to load calendar tasks:",
        error
      );

      setTasks([]);
    }
  }

  // Initial load
  loadTasks();

  // Cross-tab/localStorage changes
  window.addEventListener(
    "storage",
    loadTasks
  );

  // Same-tab TaskBoard changes
  window.addEventListener(
    "ablespace-tasks-updated",
    loadTasks
  );

  // Backup sync
  const interval = window.setInterval(
    loadTasks,
    1000
  );

  return () => {
    window.removeEventListener(
      "storage",
      loadTasks
    );

    window.removeEventListener(
      "ablespace-tasks-updated",
      loadTasks
    );

    window.clearInterval(interval);
  };
}, []);


  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const previousMonthDays = new Date(
      year,
      month,
      0
    ).getDate();

    const days: {
      date: Date;
      isCurrentMonth: boolean;
    }[] = [];

    for (
      let index = firstDay - 1;
      index >= 0;
      index--
    ) {
      days.push({
        date: new Date(
          year,
          month - 1,
          previousMonthDays - index
        ),
        isCurrentMonth: false,
      });
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push({
        date: new Date(
          year,
          month,
          day
        ),
        isCurrentMonth: true,
      });
    }

    let nextMonthDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(
          year,
          month + 1,
          nextMonthDay
        ),
        isCurrentMonth: false,
      });

      nextMonthDay++;
    }

    return days;
  }, [year, month]);

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    tasks.forEach((task) => {
      const parsedDate = parseTaskDate(
        task.dueDate
      );

      if (!parsedDate) return;

      const key = getDateKey(parsedDate);

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(task);
    });

    return grouped;
  }, [tasks]);

  const selectedTasks = selectedDateKey
    ? tasksByDate[selectedDateKey] ?? []
    : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayKey = getDateKey(today);

  function goToPreviousMonth() {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  }

  function goToNextMonth() {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  }

  function goToToday() {
    const now = new Date();

    setCurrentDate(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
    );

    setSelectedDateKey(getDateKey(now));
  }

  function getSelectedDateLabel() {
    if (!selectedDateKey) return "";

    const [selectedYear, selectedMonth, selectedDay] =
      selectedDateKey.split("-").map(Number);

    const selectedDate = new Date(
      selectedYear,
      selectedMonth - 1,
      selectedDay
    );

    return selectedDate.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Calendar
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            See your tasks, deadlines and completion
            schedule.
          </p>
        </div>

        {/* Calendar */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {monthName}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                ←
              </button>

              <button
                type="button"
                onClick={goToToday}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Today
              </button>

              <button
                type="button"
                onClick={goToNextMonth}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                →
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
            {weekDays.map((day) => (
              <div
                key={day}
                className="px-2 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map(
              ({
                date,
                isCurrentMonth,
              }) => {
                const dateKey =
                  getDateKey(date);

                const dayTasks =
                  tasksByDate[dateKey] ?? [];

                const isToday =
                  dateKey === todayKey;

                const isSelected =
                  selectedDateKey === dateKey;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => {
                      setSelectedDateKey(
                        dateKey
                      );
                    }}
                    className={`min-h-32 border-b border-r border-slate-200 p-2 text-left transition-colors dark:border-slate-700 ${
                      isSelected
                        ? "bg-slate-100 ring-2 ring-inset ring-slate-400 dark:bg-slate-800 dark:ring-slate-500"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    } ${
                      !isCurrentMonth
                        ? "bg-slate-50/70 dark:bg-slate-950/50"
                        : ""
                    }`}
                  >
                    {/* Date */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                          isToday
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                            : isCurrentMonth
                              ? "text-slate-700 dark:text-slate-300"
                              : "text-slate-400 dark:text-slate-600"
                        }`}
                      >
                        {date.getDate()}
                      </span>

                      {dayTasks.length > 0 && (
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                          {dayTasks.length}{" "}
                          {dayTasks.length === 1
                            ? "task"
                            : "tasks"}
                        </span>
                      )}
                    </div>

                    {/* Tasks */}
                    <div className="mt-2 space-y-1.5">
                      {dayTasks
                        .slice(0, 3)
                        .map((task) => (
                          <div
                            key={task.id}
                            className={`rounded-md border px-2 py-1.5 text-[11px] font-medium ${getTaskStatusClass(
                              task
                            )}`}
                          >
                            <div className="truncate">
                              {task.status ===
                              "completed"
                                ? "✓ "
                                : ""}
                              {task.title}
                            </div>
                          </div>
                        ))}

                      {dayTasks.length > 3 && (
                        <div className="px-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          +{dayTasks.length - 3}{" "}
                          more
                        </div>
                      )}
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* Selected Date Details */}
        {selectedDateKey && (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Tasks for{" "}
                {getSelectedDateLabel()}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {selectedTasks.length === 0
                  ? "No tasks scheduled for this date."
                  : `${selectedTasks.length} ${
                      selectedTasks.length === 1
                        ? "task"
                        : "tasks"
                    } scheduled for this date.`}
              </p>
            </div>

            {selectedTasks.length > 0 && (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {selectedTasks.map(
                  (task) => (
                    <div
                      key={task.id}
                      className={`rounded-lg border p-4 ${getTaskStatusClass(
                        task
                      )}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold">
                            {task.status ===
                            "completed"
                              ? "✓ "
                              : ""}
                            {task.title}
                          </h3>

                          <p className="mt-1 text-xs opacity-80">
                            {task.description ||
                              "No description"}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-white/70 px-2 py-1 text-[10px] font-semibold capitalize dark:bg-black/20">
                          {task.priority}
                        </span>
                      </div>

                      <div className="mt-3 text-xs font-semibold">
                        {getDeadlineMessage(
                          task
                        )}
                      </div>

                      <div className="mt-2 text-[11px] opacity-70">
                        Due: {task.dueDate}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* Legend */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Deadline status
          </h2>

          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-green-50 px-3 py-1.5 font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300">
              🟢 5+ days left
            </span>

            <span className="rounded-full bg-amber-50 px-3 py-1.5 font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              🟠 2–4 days left
            </span>

            <span className="rounded-full bg-red-50 px-3 py-1.5 font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">
              🔴 Due soon
            </span>

            <span className="rounded-full bg-red-100 px-3 py-1.5 font-bold text-red-900 dark:bg-red-950/70 dark:text-red-300">
              🟥 ⚠ Overdue
            </span>

            <span className="rounded-full bg-green-50 px-3 py-1.5 font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300">
              ✓ Completed
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

