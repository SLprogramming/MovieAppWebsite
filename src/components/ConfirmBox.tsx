import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type ConfirmBoxProps = {
  isOpen: boolean;
  title?: string;
  message?: React.ReactNode;
  onClose: () => void;
  onDetail: () => void;
  onDelete: () => void;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  disableBackdropClick?: boolean;
  ariaLabelledBy?: string;
};

function ensurePortalRoot(): HTMLElement {
  const id = "confirmbox-portal-root";
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    document.body.appendChild(el);
  }
  return el;
}

export default function ConfirmBox({
  isOpen,
  title = "Actions",
  message = "",
  onClose,
  onDetail,
  onDelete,
  confirmText = "Detail",
  cancelText = "Delete",
  destructive = false,
  disableBackdropClick = false,
  ariaLabelledBy,
}: ConfirmBoxProps) {
  const portalRoot = (typeof document !== "undefined") ? ensurePortalRoot() : null;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      lastActiveElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!portalRoot || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/50"
        onMouseDown={(e) => {
          if (disableBackdropClick) return;
          if (e.target === e.currentTarget) onClose();
        }}
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 max-w-lg w-full rounded-2xl shadow-2xl p-6 outline-none transform transition-all scale-100"
        style={{
          backgroundColor: "var(--primary-bg)",
          color: "var(--text)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-4">
          <h2
            id={ariaLabelledBy}
            className="text-lg font-semibold text-center"
            style={{ color: "var(--text-highlight)" }}
          >
            {title}
          </h2>
        </header>

        <div className="mb-6 text-sm text-center">
          {message}
        </div>

        <footer className="flex items-center justify-center gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "var(--secondary-bg)",
              color: "var(--text)",
            }}
            onClick={onDelete}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{
              backgroundColor: destructive ? "var(--favorite)" : "var(--primary)",
              color: "var(--text-highlight)",
            }}
            onClick={() => {
              onDetail();
            }}
          >
            {confirmText}
          </button>
        </footer>
      </div>
    </div>,
    portalRoot
  );
}