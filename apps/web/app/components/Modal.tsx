import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  // ESCキーで閉じる
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div
        className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
          aria-label="閉じる"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
} 