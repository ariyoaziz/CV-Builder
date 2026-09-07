"use client";

import { useState, KeyboardEvent, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  /** Current tags array (controlled) */
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  /** Maximum number of tags allowed */
  maxTags?: number;
  /** Accessible label for the input */
  "aria-label"?: string;
  id?: string;
  className?: string;
}

/**
 * Controlled chip/tag input component.
 *
 * Behavior:
 * - Enter or comma (,) confirms the current input as a new tag.
 * - Backspace on empty input removes the last tag.
 * - Tags are trimmed and deduplicated (case-insensitive, within the passed `value`).
 * - Empty strings are not accepted.
 */
export function TagInput({
  value,
  onChange,
  placeholder = "Tambah tag…",
  maxTags,
  "aria-label": ariaLabel,
  id,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTags = (raw: string) => {
    if (!raw.trim()) return;
    const parts = raw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (parts.length === 0) {
      setInputValue("");
      return;
    }

    const newTags = [...value];
    for (const part of parts) {
      if (maxTags !== undefined && newTags.length >= maxTags) break;
      const isDuplicate = newTags.some(
        (existing) => existing.toLowerCase() === part.toLowerCase()
      );
      if (!isDuplicate) {
        newTags.push(part);
      }
    }

    onChange(newTags);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTags(inputValue);
    } else if (e.key === "Backspace" && inputValue === "") {
      // Remove last tag on backspace when input is empty
      if (value.length > 0) {
        onChange(value.slice(0, -1));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // If user types or pastes comma, process tags immediately
    if (raw.includes(",")) {
      addTags(raw);
    } else {
      setInputValue(raw);
    }
  };

  const isAtMax = maxTags !== undefined && value.length >= maxTags;

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1.5 p-2 min-h-10 rounded-md border border-slate-200 bg-white",
        "focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500",
        className
      )}
      onClick={() => inputRef.current?.focus()}
      role="group"
      aria-label={ariaLabel}
    >
      {value.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            aria-label={`Hapus ${tag}`}
            className="rounded-full p-0.5 hover:bg-blue-200 text-blue-700 hover:text-blue-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-colors inline-flex items-center justify-center cursor-pointer"
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </button>
        </span>
      ))}

      {!isAtMax && (
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => addTags(inputValue)}
          placeholder={value.length === 0 ? placeholder : ""}
          aria-label={ariaLabel ?? placeholder}
          className="flex-1 min-w-30 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
        />
      )}
    </div>
  );
}
