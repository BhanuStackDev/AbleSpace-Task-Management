"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header searchQuery="" onSearchChange={() => {}} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Projects
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Organize your work into projects and keep everything structured.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
                    □
                  </div>

                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                    No projects yet
                  </h2>

                  <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                    Projects will help you group and manage related tasks in one place.
                  </p>

                  <button
                    type="button"
                    className="mt-6 rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  >
                    + Create Project
                  </button>
                </div>
              </div>
            </div>
          </main>
        </section>
      </div>
    </main>
  );
}
