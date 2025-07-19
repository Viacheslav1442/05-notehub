import css from "./NoteList.module.css";
import type { Note } from "../../types/note.ts";
import NoteItem from "./NoteItem.tsx";
import type { ModalVariant } from "../../enums";

export interface NoteListProps {
    notes: Note[];
    setCurrentNote: (note: Note) => void;
    setVariant: (variant: ModalVariant) => void;
    onDelete: (id: number) => void;
}

const NoteList = ({ notes = [], setCurrentNote, setVariant, onDelete }: NoteListProps) => {
    if (notes.length === 0) {
        return <p>No notes found</p>;
    }

    return (
        <ul className={`${css.list} container`}>
            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    note={note}
                    setCurrentNote={setCurrentNote}
                    setVariant={setVariant}
                    onDelete={onDelete} // передаємо вниз
                />
            ))}
        </ul>
    );
};

export default NoteList;
