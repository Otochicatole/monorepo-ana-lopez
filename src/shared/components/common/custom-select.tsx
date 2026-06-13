"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

function toSelectValue<V extends string | number>(value: V | null | undefined): V | "" {
  if (value === null || value === undefined || value === "") return "";
  return value;
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

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

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
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition | null>(null);
  const [formValue, setFormValue] = useState<V | "">(() => toSelectValue(value));
  const s = SIZE[size];

  const isControlled = onChange !== undefined;
  const resolvedValue = isControlled ? toSelectValue(value) : formValue;

  const flat = flatOptions(options);
  const selected = flat.find((o) => o.value === resolvedValue) ?? null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isControlled) {
      setFormValue(toSelectValue(value));
    }
  }, [value, isControlled]);

  function updateDropdownPosition() {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const maxHeight = 256;
    const openUp = spaceBelow < maxHeight && spaceAbove > spaceBelow;

    setDropdownPos({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(maxHeight, openUp ? spaceAbove - 12 : spaceBelow - 12),
      top: openUp ? Math.max(8, rect.top - Math.min(maxHeight, spaceAbove - 12) - 6) : rect.bottom + 6,
    });
  }

  // Close on outside click / Escape; reposition on scroll/resize
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

    function onReposition() {
      updateDropdownPosition();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  function toggleOpen() {
    if (disabled) return;
    if (!open) {
      updateDropdownPosition();
      setOpen(true);
      return;
    }
    setOpen(false);
  }

  function select(option: SelectOption<V>) {
    if (option.disabled) return;

    if (isControlled) {
      onChange(option.value);
    } else {
      setFormValue(option.value);
    }

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
        aria-selected={option.value === resolvedValue}
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
          option.value === resolvedValue
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
        {option.value === resolvedValue && (
          <Check className={cn("shrink-0 text-pk", s.icon)} aria-hidden />
        )}
      </li>
    ));
  }

  const dropdown = open && dropdownPos ? (
    <ul
      ref={listRef}
      id={listId}
      role="listbox"
      onKeyDown={onListKeyDown}
      style={{
        position: "fixed",
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: dropdownPos.width,
        maxHeight: dropdownPos.maxHeight,
        zIndex: 9999,
      }}
      className={cn(
        "overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 p-1.5 shadow-xl shadow-black/40",
        s.dropdown
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
  ) : null;

  return (
    <div className={cn("relative", className)}>
      {/* Hidden native select for form submission */}
      {name && (
        <select
          name={name}
          value={String(resolvedValue)}
          required={required}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          className="sr-only"
        >
          <option value="" />
          {flat.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
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
          resolvedValue !== "" ? `${listId}-${String(resolvedValue)}` : undefined
        }
        disabled={disabled}
        onClick={toggleOpen}
        className={cn(
          "flex w-full cursor-pointer items-center rounded-xl border bg-neutral-900/70 text-left font-medium transition-colors",
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

      {mounted && dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  );
}
