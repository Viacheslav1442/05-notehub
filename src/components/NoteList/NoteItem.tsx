import css from "./NoteList.module.css";
import type { Note } from "../../types/note.ts";
import type { ModalVariant } from "../../enums";
import { useDeleteNote } from "../../hooks/useDeleteNote.ts";
import { type MouseEvent } from "react";

export interface NoteItemProps {
    note: Note;
    setCurrentNote: (note: Note) => void;
    setVariant: (variant: ModalVariant) => void;
}

const NoteItem = ({ note, setCurrentNote }: NoteItemProps) => {
    const deleteNote = useDeleteNote();
    const handleClickCard = () => {
        setCurrentNote(note);
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
                        deleteNote.mutate(String(note.id));
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