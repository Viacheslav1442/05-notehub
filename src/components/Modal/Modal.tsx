import css from './Modal.module.css';
import { useEffect, type ReactNode, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };


        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const onBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };


    return createPortal(
        <div className={css.backdrop} onClick={onBackdropClick}>
            <div className={css.modal} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;