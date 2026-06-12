"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/features/admin/presentation/lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SelectOption<V extends string | number = string> = {
  value: V;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type SelectGroup<V extends string | number = string> = {
  label: string;
  options: SelectOption<V>[];
};

type SelectOptions<V extends string | number> =
  | SelectOption<V>[]
  | SelectGroup<V>[];

function isGrouped<V extends string | number>(
  opts: SelectOptions<V>
): opts is SelectGroup<V>[] {
  return opts.length > 0 && "options" in opts[0];
}

function flatOptions<V extends string | number>(
  opts: SelectOptions<V>
): SelectOption<V>[] {
  if (isGrouped(opts)) return opts.flatMap((g) => g.options);
  return opts as SelectOption<V>[];
}

// ─── Sizes ───────────────────────────────────────────────────────────────────

const SIZE = {
  sm: {
    trigger: "h-8 px-3 text-xs gap-2",
    icon: "h-3.5 w-3.5",
    dropdown: "text-xs",
    option: "px-3 py-2",
    groupLabel: "px-3 pt-3 pb-1",
  },
  md: {
    trigger: "h-10 px-3.5 text-sm gap-2",
    icon: "h-4 w-4",
    dropdown: "text-sm",
    option: "px-3.5 py-2.5",
    groupLabel: "px-3.5 pt-3.5 pb-1",
  },
  lg: {
    trigger: "h-12 px-4 text-base gap-2.5",
    icon: "h-5 w-5",
    dropdown: "text-base",
    option: "px-4 py-3",
    groupLabel: "px-4 pt-4 pb-1",
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

type CustomSelectProps<V extends string | number = string> = {
  options: SelectOptions<V>;
  value?: V | null;
  onChange?: (value: V) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: keyof typeof SIZE;
  className?: string;
  /** Renders a native hidden <select> with this name so it works inside forms */
  name?: string;
  required?: boolean;
};

export function CustomSelect<V extends string | number = string>({
  options,
  value,
  onChange,
  placeholder = "Select…",
  disabled = false,
  size = "md",
  className,
  name,
  required,
}: CustomSelectProps<V>) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const s = SIZE[size];

  const flat = flatOptions(options);
  const selected = flat.find((o) => o.value === value) ?? null;

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !listRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Decide if dropdown opens up or down
  function toggleOpen() {
    if (disabled) return;
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 280);
    }
    setOpen((prev) => !prev);
  }

  function select(option: SelectOption<V>) {
    if (option.disabled) return;
    onChange?.(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  // Keyboard navigation inside list
  function onListKeyDown(e: React.KeyboardEvent) {
    const items = listRef.current?.querySelectorAll<HTMLElement>(
      "[role=option]:not([aria-disabled=true])"
    );
    if (!items?.length) return;

    const focused = document.activeElement as HTMLElement;
    const idx = Array.from(items).indexOf(focused);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[idx < items.length - 1 ? idx + 1 : 0]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[idx > 0 ? idx - 1 : items.length - 1]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      focused?.click();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  function renderOptions(opts: SelectOption<V>[]) {
    return opts.map((option) => (
      <li
        key={String(option.value)}
        id={`${listId}-${String(option.value)}`}
        role="option"
        aria-selected={option.value === value}
        aria-disabled={option.disabled}
        tabIndex={option.disabled ? -1 : 0}
        onClick={() => select(option)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            select(option);
          }
        }}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg transition-colors outline-none",
          s.option,
          option.value === value
            ? "bg-pk/15 text-pk"
            : "text-white/80 hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white",
          option.disabled && "pointer-events-none opacity-40"
        )}
      >
        <span className="flex-1 leading-snug">
          {option.label}
          {option.description && (
            <span className="mt-0.5 block text-[11px] opacity-50">
              {option.description}
            </span>
          )}
        </span>
        {option.value === value && (
          <Check className={cn("shrink-0 text-pk", s.icon)} aria-hidden />
        )}
      </li>
    ));
  }

  return (
    <div className={cn("relative", className)}>
      {/* Hidden native select for form submission */}
      {name && (
        <select
          name={name}
          value={value ?? ""}
          required={required}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          className="sr-only"
        >
          <option value="" />
          {flat.map((o) => (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-activedescendant={
          value != null ? `${listId}-${String(value)}` : undefined
        }
        disabled={disabled}
        onClick={toggleOpen}
        className={cn(
          "flex w-full items-center rounded-xl border bg-neutral-900/70 text-left font-medium transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pk",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open
            ? "border-pk/50 ring-2 ring-pk/20"
            : "border-white/10 hover:border-white/20",
          s.trigger
        )}
      >
        <span
          className={cn(
            "flex-1 truncate",
            selected ? "text-white" : "text-white/35"
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "shrink-0 text-white/40 transition-transform duration-200",
            s.icon,
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          onKeyDown={onListKeyDown}
          className={cn(
            "absolute z-50 max-h-64 w-full min-w-[180px] overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 p-1.5 shadow-xl shadow-black/40",
            s.dropdown,
            dropUp ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"
          )}
        >
          {isGrouped(options)
            ? (options as SelectGroup<V>[]).map((group) => (
                <li key={group.label} role="presentation">
                  <p
                    className={cn(
                      "font-semibold uppercase tracking-widest text-white/30",
                      s.groupLabel
                    )}
                  >
                    {group.label}
                  </p>
                  <ul role="group">{renderOptions(group.options)}</ul>
                </li>
              ))
            : renderOptions(flat)}
        </ul>
      )}
    </div>
  );
}
