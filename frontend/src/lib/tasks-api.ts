import type { Task, TaskPriority, TaskStatus } from "@/types/task";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://ablespace-backend-7gu3.onrender.com/api";

export type ApiTask = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function apiTaskToUiTask(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? formatDisplayDate(task.dueDate) : "",
    createdAt: formatDisplayDate(task.createdAt),
  };
}

function formatDisplayDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function uiDateToIso(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
}

export async function getTasks() {
  return request<ApiTask[]>("/tasks");
}

export async function createTask(input: { title: string; description: string; priority: TaskPriority; dueDate: string }) {
  return request<ApiTask>("/tasks", {
    method: "POST",
    body: JSON.stringify({ ...input, dueDate: input.dueDate || undefined }),
  });
}

export async function updateTask(id: string, input: Partial<{ title: string; description: string; status: TaskStatus; priority: TaskPriority; dueDate: string | null }>) {
  const payload = { ...input } as Record<string, unknown>;
  if (typeof input.dueDate === "string") payload.dueDate = uiDateToIso(input.dueDate);
  return request<ApiTask>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function deleteTask(id: string) {
  return request<{ success: boolean }>(`/tasks/${id}`, { method: "DELETE" });
}
