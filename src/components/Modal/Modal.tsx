import css from './Modal.module.css';
import { type ReactNode, type MouseEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
    useEffect(() => {
        const handlePressEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handlePressEsc);

        // Disable scroll on mount
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handlePressEsc);
            // Restore scroll on unmount
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return createPortal(
        <div className={css.backdrop} onClick={onClose}>
            <div
                className={css.modal}
                onClick={(event: MouseEvent) => {
                    event.stopPropagation();
                }}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;