import css from "./NoteList.module.css";
import type { Note } from "../../types/note.ts";
import NoteItem from "./NoteItem.tsx";
import type { ModalVariant } from "../../enums";

export interface NoteListProps {
    notes: Note[];
    setCurrentNote: (note: Note) => void;
    setVariant: (variant: ModalVariant) => void;
}

const NoteList = ({ notes, setCurrentNote, setVariant }: NoteListProps) => {
    return (
        <ul className={`${css.list} container`}>
            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    note={note}
                    setCurrentNote={setCurrentNote}
                    setVariant={setVariant}
                />
            ))}
        </ul>
    );
};

export default NoteList;