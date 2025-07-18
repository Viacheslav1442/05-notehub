import css from './Modal.module.css';

import { useEffect, type ReactNode, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const onBackdropClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <div
            style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 1000,
            }}
            onClick={onBackdropClick}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    borderRadius: 8,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    maxWidth: '90vw',
                }}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;