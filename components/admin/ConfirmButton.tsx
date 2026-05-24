"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmButton({
  message,
  title = "Confirm Action",
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  onClick,
  children,
  ...props
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const confirmedRef = useRef(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusId = requestAnimationFrame(() => cancelRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusId);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const modal = open ? (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md rounded-lg border border-border bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle aria-hidden="true" size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2
                id="confirm-dialog-title"
                className="text-base font-semibold text-text-primary"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
                aria-label="Close confirmation dialog"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <p
              id="confirm-dialog-description"
              className="mt-2 text-sm leading-relaxed text-text-muted"
            >
              {message}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-primary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              confirmedRef.current = true;
              setOpen(false);
              requestAnimationFrame(() => buttonRef.current?.click());
            }}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        {...props}
        ref={buttonRef}
        onClick={(event) => {
          if (!confirmedRef.current) {
            event.preventDefault();
            setOpen(true);
            return;
          }

          confirmedRef.current = false;
          onClick?.(event);
        }}
      >
        {children}
      </button>
      {typeof document !== "undefined" && modal
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}
