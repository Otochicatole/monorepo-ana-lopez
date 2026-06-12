"use client";

import { useRef, useState } from "react";
import { AdminModal } from "./modal";
import { Button } from "./button";
import { cn } from "@/features/admin/presentation/lib/cn";

type ConfirmDeleteButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  id: number | string;
  idFieldName?: string;
  itemName: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  buttonLabel?: string;
  buttonClassName?: string;
  buttonSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

export function ConfirmDeleteButton({
  action,
  id,
  idFieldName = "id",
  itemName,
  title = "Delete item?",
  description,
  confirmLabel = "Delete",
  buttonLabel = "Delete",
  buttonClassName,
  buttonSize = "sm",
  fullWidth = false,
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const resolvedDescription =
    description ??
    `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;

  function handleConfirm() {
    formRef.current?.requestSubmit();
    setOpen(false);
  }

  return (
    <>
      <form ref={formRef} action={action} className="hidden" aria-hidden="true">
        <input type="hidden" name={idFieldName} value={String(id)} />
      </form>

      <Button
        type="button"
        variant="danger"
        size={buttonSize}
        className={cn(fullWidth && "w-full", buttonClassName)}
        onClick={() => setOpen(true)}
      >
        {buttonLabel}
      </Button>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={resolvedDescription}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </>
        }
      />
    </>
  );
}
