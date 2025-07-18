import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import * as noteService from '../../services/noteService';
import toast from 'react-hot-toast';

interface NoteListProps {
    notes: Note[];
    onNoteClick: (id: number) => void;
}

const NoteList = ({ notes, onNoteClick }: NoteListProps) => {
    const queryClient = useQueryClient();

    // Мутація для видалення нотатки
    const deleteMutation = useMutation<void, Error, number>(
        (id: number) => noteService.deleteNote(id),
        {
            onSuccess: () => {
                toast.success('Note deleted successfully');
                queryClient.invalidateQueries(['notes']);
            },
            onError: (error) => {
                // безпечна перевірка помилки
                const message =
                    error instanceof Error ? error.message : 'Unknown error';
                toast.error(message);
            },
        }
    );

    if (notes.length === 0) return <p>No notes found</p>;

    return (
        <ul>
            {notes.map(note => (
                <li key={note.id} style={{ marginBottom: '1rem' }}>
                    <div
                        onClick={() => onNoteClick(note.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <p><b>Tag:</b> {note.tag}</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // щоб не викликати onNoteClick
                            if (window.confirm('Delete this note?')) {
                                deleteMutation.mutate(note.id);
                            }
                        }}
                        style={{ marginTop: '0.5rem', color: 'red' }}
                        disabled={deleteMutation.isLoading}
                    >
                        {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default NoteList;