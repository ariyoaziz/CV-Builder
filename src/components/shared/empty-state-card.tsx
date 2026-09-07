"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

/**
 * Reusable empty-state placeholder rendered when a list section has no items.
 */
export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateCardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/60">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 mb-3">
        <Icon className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-slate-700 mb-1">{title}</p>
      <p className="text-xs text-slate-500 mb-4 max-w-60">{description}</p>
      <Button size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
