"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/i18n";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemLabel?: string;
}

/**
 * Reusable confirmation dialog for destructive item deletion.
 * Requires explicit user confirmation before firing onConfirm.
 */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemLabel,
}: DeleteConfirmDialogProps) {
  const { t, language } = useTranslation();
  const label = itemLabel || (language === "en" ? "this item" : "entri ini");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === "en" ? `Delete ${label}?` : `Hapus ${label}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === "en"
              ? `This action cannot be undone. ${label} will be permanently removed from your CV.`
              : `Tindakan ini tidak dapat dibatalkan. Data ${label} akan dihapus secara permanen dari CV Anda.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t.common.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

