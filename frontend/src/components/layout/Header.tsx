"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";
import { endGuestSession } from "@/lib/guest-auth";

type HeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export default function Header({
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    endGuestSession();
    setMenuOpen(false);
    router.replace("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
            Task Management
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800 sm:flex">
          <span className="mr-2 text-sm text-slate-400">⌕</span>

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search..."
            className="h-9 w-32 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500 md:w-44"
            aria-label="Search tasks"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="ml-1 text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          title={`Current theme: ${theme}`}
        >
          {theme === "light" ? "☾" : "☀"}
        </button>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          ♧
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 sm:px-3"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
              G
            </span>

            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 md:block">
              Guest
            </span>

            <span className="hidden text-xs text-slate-400 md:block">
              ⌄
            </span>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
