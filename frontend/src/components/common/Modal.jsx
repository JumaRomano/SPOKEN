import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import Button from './Button';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'medium',
    closeOnOverlayClick = true
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        small: 'max-w-md',
        medium: 'max-w-xl',
        large: 'max-w-3xl',
        full: 'max-w-full m-4'
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
            <div
                className={clsx(
                    "fixed inset-0 transition-opacity",
                )}
                onClick={closeOnOverlayClick ? onClose : undefined}
                aria-hidden="true"
            />

            <div
                className={clsx(
                    "relative w-full bg-white rounded-xl shadow-2xl transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]",
                    sizes[size]
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <h3 id="modal-title" className="text-lg font-semibold text-secondary-dark">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-1 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl shrink-0 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
