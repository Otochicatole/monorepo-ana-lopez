"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type AdminModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
};

function ModalPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}

function useModalEffects(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);
}

export function AdminModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: AdminModalProps) {
  const titleId = useId();
  useModalEffects(open, onClose);

  if (!open) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-100 flex items-center justify-center p-4"
        role="presentation"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold text-white">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm text-white/50">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 cursor-pointer text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {children ? (
            <div className="overflow-y-auto p-5">{children}</div>
          ) : null}

          {footer ? (
            <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </ModalPortal>
  );
}

export function AdminModalWide({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: AdminModalProps) {
  const titleId = useId();
  useModalEffects(open, onClose);

  if (!open) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-100 flex items-center justify-center p-4"
        role="presentation"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold text-white">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm text-white/50">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 cursor-pointer text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {children ? (
            <div className="overflow-y-auto p-5">{children}</div>
          ) : null}

          {footer ? (
            <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 px-5 py-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </ModalPortal>
  );
}
