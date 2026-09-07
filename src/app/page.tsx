"use client";

import { useCVStore } from "@/store/useCVStore";
import { AppShell } from "@/components/layout/app-shell";

/**
 * Root page — mounts the application shell after Zustand LocalStorage
 * rehydration is complete to prevent hydration mismatches.
 *
 * isHydrated is set by Zustand's onRehydrateStorage callback once
 * localStorage has been read on the client. During SSR this is always
 * false, so the loading state is rendered on first paint and replaced
 * once hydration completes on the client without requiring an extra
 * state/effect cycle.
 */
export default function Home() {
  const isHydrated = useCVStore((state) => state.isHydrated);

  if (!isHydrated) {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center bg-slate-50"
        aria-label="Memuat CV Builder…"
        role="status"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-xs text-slate-400">Memuat…</p>
        </div>
      </div>
    );
  }

  return <AppShell />;
}
