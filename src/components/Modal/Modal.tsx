import css from './Modal.module.css'
import { type MouseEvent, type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

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
        }

        document.addEventListener('keydown', handlePressEsc)

        return () => {
            document.removeEventListener('keydown', handlePressEsc)
        }

    }, [onClose]);
    return createPortal(
        <div className={css.backdrop} onClick={onClose}>
            <div
                className={css.modal}
                onClick={(event: MouseEvent) => {
                    event.stopPropagation();
                }}>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement
    )
};


export default Modal;