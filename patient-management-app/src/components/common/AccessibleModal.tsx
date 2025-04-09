import React from 'react';
import { createPortal } from 'react-dom';
import { trapFocus, ARIA_LABELS, KeyboardKeys, announceToScreenReader, setupFocusManagement } from '../../utils/accessibility';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  ariaDescription?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  ariaDescription,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = React.useRef<HTMLElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      
      // Focus management
      if (modalRef.current) {
        const removeTrapFocus = trapFocus(modalRef.current);
        const focusManager = setupFocusManagement(modalRef.current);
        focusManager.focusFirst();
        
        // Announce to screen readers
        announceToScreenReader(`${title} dialog opened`);
        
        return () => {
          document.body.style.overflow = '';
          previouslyFocusedElement.current?.focus();
          removeTrapFocus();
        };
      }
    }
  }, [isOpen, title]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KeyboardKeys.ESCAPE && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside to close modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayRef.current === e.target) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      ref={overlayRef} 
      onClick={handleOverlayClick}
      className="modal-overlay"
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={ariaDescription ? "modal-description" : undefined}
        className="modal-content"
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={ARIA_LABELS.CLOSE}
            className="modal-close-button"
          >
            &times;
          </button>
        </div>
        
        {ariaDescription && (
          <div id="modal-description" className="sr-only">
            {ariaDescription}
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
