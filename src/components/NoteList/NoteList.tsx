import css from "./NoteList.module.css";
import type { Note } from "../../types/note.ts";
import NoteItem from "./NoteItem.tsx";
import type { ModalVariant } from "../../enums";

export interface NoteListProps {
    notes?: Note[];
    setCurrentNote: (note: Note) => void;
    setVariant: (variant: ModalVariant) => void;
}

const NoteList = ({ notes = [], setCurrentNote, setVariant }: NoteListProps) => {
    return (
        <ul className={`${css.list} container`}>
            {notes.length > 0 ? (
                notes.map((note) => (
                    <NoteItem
                        note={note}
                        key={note.id}
                        setVariant={setVariant}
                        setCurrentNote={setCurrentNote}
                    />
                ))
            ) : (
                <p>No notes found</p>
            )}
        </ul>
    );
};

export default NoteList;