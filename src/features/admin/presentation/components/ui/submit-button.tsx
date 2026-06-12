"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "./button";

type SubmitButtonProps = Omit<ButtonProps, "type"> & {
  pendingLabel?: string;
  /** Override form pending state (e.g. useActionState or FormPendingBridge). */
  pending?: boolean;
  form?: string;
};

export function SubmitButton({
  children,
  pendingLabel,
  pending: pendingOverride,
  disabled,
  form,
  ...props
}: SubmitButtonProps) {
  const { pending: formPending } = useFormStatus();
  const pending = pendingOverride ?? formPending;

  return (
    <Button type="submit" form={form} disabled={disabled || pending} {...props}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}

/** Syncs form pending state to a parent (e.g. modal footer submit buttons). */
export function FormPendingBridge({
  onPendingChange,
}: {
  onPendingChange: (pending: boolean) => void;
}) {
  const { pending } = useFormStatus();

  useEffect(() => {
    onPendingChange(pending);
  }, [pending, onPendingChange]);

  return null;
}
