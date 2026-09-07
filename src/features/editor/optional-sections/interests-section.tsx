"use client";

import React, { useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Heart, EyeOff } from "lucide-react";
import { useTranslation } from "@/i18n";

export function InterestsSection() {
  const { t, language } = useTranslation();
  const interests = useCVStore(
    (state) => state.cvData.optionalSections?.interests ?? { enabled: false, items: [] }
  );
  const setInterests = useCVStore((state) => state.setInterests);
  const toggleOptionalSection = useCVStore((state) => state.toggleOptionalSection);

  const [inputVal, setInputVal] = useState("");

  const handleAdd = (val?: string) => {
    const textToAdd = (val ?? inputVal).trim();
    if (!textToAdd) return;

    if (!interests.items.includes(textToAdd)) {
      setInterests([...interests.items, textToAdd]);
    }
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    const updated = interests.items.filter((_, i) => i !== index);
    setInterests(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-slate-500">
          {t.optionalSections.interests.helper}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleOptionalSection("interests", false)}
          className="h-7 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
        >
          <EyeOff className="h-3 w-3 mr-1" />
          {t.editor.optionalSectionPicker.hideSection}
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="interest-input" className="text-xs font-medium">
          {t.optionalSections.interests.tagLabel}
        </Label>
        <div className="flex gap-2">
          <Input
            id="interest-input"
            placeholder={t.optionalSections.interests.tagPlaceholder}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 text-xs"
          />
          <Button
            type="button"
            onClick={() => handleAdd()}
            disabled={!inputVal.trim()}
            className="gap-1 h-8 text-xs px-3"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.common.add}</span>
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {t.optionalSections.interests.tagHelp}
        </p>
      </div>

      {interests.items.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Heart className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">{t.optionalSections.interests.emptyTitle}</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              {t.optionalSections.interests.emptyDesc}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg border border-border bg-background">
            {interests.items.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="rounded-full hover:bg-primary/20 p-0.5 text-primary/70 hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label={language === "en" ? `Remove interest ${item}` : `Hapus minat ${item}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {language === "en" ? `Total ${interests.items.length} interests added.` : `Total ${interests.items.length} minat terdaftar.`}
          </p>
        </div>
      )}
    </div>
  );
}
