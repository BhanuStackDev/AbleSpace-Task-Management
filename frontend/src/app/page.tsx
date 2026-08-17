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

  useEffect(() => {
    if (!isGuestSessionActive()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <TaskBoard searchQuery={searchQuery} />
            </div>
          </main>
        </section>
      </div>
    </main>
  );
}