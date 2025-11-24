import { useEffect, type ReactNode } from "react";
import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
}
