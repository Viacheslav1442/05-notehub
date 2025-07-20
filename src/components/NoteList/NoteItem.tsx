import css from "./NoteList.module.css";
import type { Note } from "../../types/note.ts";
import { ModalVariant } from "../../enums";
import type { MouseEvent } from "react";

export interface NoteItemProps {
    note: Note;
    setCurrentNote: (note: Note) => void;
    setVariant: (variant: ModalVariant) => void;
    onDelete: (id: number) => void;
}

const NoteItem = ({ note, setCurrentNote, setVariant, onDelete }: NoteItemProps) => {
    const handleClickCard = () => {
        setCurrentNote(note);
        setVariant(ModalVariant.UPDATE);
    };

    return (
        <li className={css.listItem} onClick={handleClickCard}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
                <span className={css.tag}>{note.tag}</span>
                <button
                    onClick={(event: MouseEvent<HTMLButtonElement>) => {
                        event.stopPropagation();
                        onDelete(note.id);
                    }}
                    className={css.button}
                >
                    Delete
                </button>
            </div>
        </li>
    );
};

export default NoteItem;