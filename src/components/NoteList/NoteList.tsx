import type { Note } from '../../types/note';

interface NoteListProps {
    notes: Note[];
    onEdit: (note: Note) => void;
    onDelete: (id: number) => void;
}

const NoteList = ({ notes, onEdit, onDelete }: NoteListProps) => {
    if (!notes.length) return <p>No notes found</p>;

    return (
        <ul>
            {notes.map(note => (
                <li key={note.id}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <p><b>Tag:</b> {note.tag}</p>
                    <button onClick={() => onEdit(note)}>Edit</button>
                    <button onClick={() => onDelete(note.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
};

export default NoteList;
