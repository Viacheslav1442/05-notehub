import css from './Modal.module.css';
import { type MouseEvent, type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden'; // заборонити прокручування

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = ''; // повернути прокручування
        };
    }, [onClose]);

    return createPortal(
        <div className={css.backdrop} onClick={onClose}>
            <div
                className={css.modal}
                onClick={(event: MouseEvent) => event.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
