"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MenuItem = {
  label: string;
  icon: string;
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: "⌂" },
  { label: "Tasks", icon: "✓" },
  { label: "Calendar", icon: "▣" },
];

export default function Sidebar() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Dashboard");

  function handleNavigation(label: string) {
    setActiveItem(label);

    if (label === "Dashboard") {
      router.push("/dashboard");
      return;
    }

    if (label === "Tasks") {
      router.push("/");
      return;
    }

    if (label === "Calendar") {
      router.push("/calendar");
      return;
    }

    if (label === "Settings") {
      router.push("/settings");
      return;
    }
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:min-h-screen lg:flex-col dark:border-slate-700 dark:bg-slate-900">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
            A
          </div>

          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            AbleSpace
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = activeItem === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavigation(item.label)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center text-base ${
                  isActive
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <button
          type="button"
          onClick={() => handleNavigation("Settings")}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
            activeItem === "Settings"
              ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center text-base">
            ⚙
          </span>

          <span>Settings</span>
        </button>

        {/* Guest profile */}
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            G
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
              Guest User
            </p>

            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Guest account
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
