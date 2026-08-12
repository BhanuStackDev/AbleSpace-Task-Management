"use client";

import { usePathname, useRouter } from "next/navigation";

type MenuItem = {
  label: string;
  icon: string;
  path: string;
};

const menuItems: MenuItem[] = [
  { label: "Tasks", icon: "▤", path: "/" },
  { label: "Projects", icon: "□", path: "/dashboard" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:flex lg:min-h-screen lg:flex-col dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center border-b border-slate-200 px-5 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
            A
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">
            AbleSpace
          </span>
        </div>
      </div>

      <div className="px-4 pt-6">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
        <nav className="mt-2 space-y-1" aria-label="Workspace navigation">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => router.push(item.path)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <span className="w-5 text-center text-sm" aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
        <button
          type="button"
          onClick={() => router.push("/settings")}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium ${
            pathname === "/settings"
              ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <span className="w-5 text-center" aria-hidden="true">⚙</span>
          Settings
        </button>

        <div className="mt-3 flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">G</div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">Guest User</p>
            <p className="truncate text-[11px] text-slate-400">Guest account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
