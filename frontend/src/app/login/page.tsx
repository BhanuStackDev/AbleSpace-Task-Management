"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isGuestSessionActive, startGuestSession } from "@/lib/guest-auth";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.title = "Sign in · AbleSpace";
    if (isGuestSessionActive()) {
      router.replace("/");
    }
  }, [router]);

  function handleGuestLogin() {
    startGuestSession();
    router.replace("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white dark:bg-white dark:text-slate-900">A</div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">AbleSpace</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Task Management</p>
            </div>
          </div>
          <button type="button" onClick={toggleTheme} className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>{theme === "light" ? "☾" : "☀"}</button>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome to AbleSpace</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Continue as a guest to explore the task management experience.</p>

        <button type="button" onClick={handleGuestLogin} className="mt-7 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">Continue as Guest</button>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">No account is required for the assessment demo.</p>
      </section>
    </main>
  );
}
