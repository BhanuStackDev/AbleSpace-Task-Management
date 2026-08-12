
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isGuestSessionActive } from "@/lib/guest-auth";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import TaskBoard from "@/components/tasks/TaskBoard";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isGuestSessionActive()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="flex-1 bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Welcome back
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage your tasks and stay organized.
                </p>
              </div>

              <TaskBoard searchQuery={searchQuery} />
            </div>
          </main>
        </section>
      </div>
    </main>
  );
}

