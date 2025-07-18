import type { Note } from '../../types/note';

interface NoteListProps {
    notes: Note[];
    onNoteClick: (id: number) => void;
}

const NoteList = ({ notes, onNoteClick }: NoteListProps) => {
    if (notes.length === 0) return <p>No notes found</p>;

    return (
        <ul>
            {notes.map(note => (
                <li key={note.id} onClick={() => onNoteClick(note.id)} style={{ cursor: 'pointer' }}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <p><b>Tag:</b> {note.tag}</p>
                </li>
            ))}
        </ul>
    );
};

export default NoteList;