// ConfirmBox.tsx
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useConfirmBoxStore } from "../store/confirmBoxStore";

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

export default function ConfirmBox() {
  const {
    isOpen,
    title,
    message,
    functionTwoText,
    functionOneText,
    destructive,
    disableBackdropClick,
    
    functionOne, //  function one
    functionTwo, // function two
    close,
  } = useConfirmBoxStore();
const [loadingOne, setLoadingOne] = React.useState(false);
const [loadingTwo, setLoadingTwo] = React.useState(false);

  const portalRoot =
    typeof document !== "undefined" ? ensurePortalRoot() : null;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
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
  }, [isOpen, close]);

  if (!portalRoot || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/50"
        onMouseDown={(e) => {
          if (disableBackdropClick) return;
          if (e.target === e.currentTarget) close();
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
            className="text-lg font-semibold text-center"
            style={{ color: "var(--text-highlight)" }}
          >
            {title}
          </h2>
        </header>

        <div className="mb-6 text-sm text-center">{message}</div>

        <footer className="flex items-center justify-center gap-3">
         <button
  type="button"
  disabled={loadingOne}
  className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
  style={{
    backgroundColor: "var(--secondary-bg)",
    color: "var(--text)",
  }}
  onClick={async () => {
    if (!functionOne) return;
    try {
      setLoadingOne(true);
      await functionOne(); // wait for async
      close();
    } finally {
      setLoadingOne(false);
    }
  }}
>
  {loadingOne ? "Loading..." : functionOneText}
</button>


      {functionTwo && (
  <button
    type="button"
    disabled={loadingTwo}
    className="px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed"
    style={{
      backgroundColor: destructive
        ? "var(--favorite)"
        : "var(--primary)",
      color: "var(--text-highlight)",
    }}
    onClick={async () => {
      if (!functionTwo) return;
      try {
        setLoadingTwo(true);
        await functionTwo(); // wait for async
        close();
      } finally {
        setLoadingTwo(false);
      }
    }}
  >
    {loadingTwo ? "Loading..." : functionTwoText}
  </button>
)}

        </footer>
      </div>
    </div>,
    portalRoot
  );
}
