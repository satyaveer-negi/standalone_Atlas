// src/components/ui/ConfirmModal.tsx

import { useState } from "react";

interface Props {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

function ConfirmModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-modal-backdrop fixed inset-0 flex items-center justify-center px-4 z-50">
      <div
        className="
        w-full max-w-sm
        bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 text-center shadow-xl
      "
      >
        {/* Title */}
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">{title}</h2>

        {/* Message */}
        <p className="text-[var(--color-text-muted)] text-sm mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 text-sm">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="
              bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)] text-white font-semibold flex-1 py-2 rounded-xl transition-all shadow-md shadow-[var(--color-danger-soft)]
              disabled:opacity-50
            "
          >
            {loading ? "Processing..." : confirmText}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="
              bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border)] font-semibold flex-1 py-2 rounded-xl border border-[var(--color-border)] transition-all
            "
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
