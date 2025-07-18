import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash.debounce';

import NoteList from '../NoteList/NoteList';
import NoteForm from '../NoteForm/NoteForm';
import Modal from '../Modal/Modal';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';

import { fetchNotes, createNote, updateNote, deleteNote } from '../../services/noteService';
import type { Note, NoteCreate, NoteUpdate } from '../../types/note';

type ModalVariant = 'CREATE' | 'UPDATE';

const App = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalVariant, setModalVariant] = useState<ModalVariant>('CREATE');
    const [currentNote, setCurrentNote] = useState<Note | null>(null);

    const queryClient = useQueryClient();

    const debouncedSetSearch = useCallback(
        debounce((val: string) => {
            setDebouncedSearch(val);
        }, 500),
        []
    );

    const onSearch = (val: string) => {
        setSearchTerm(val);
        debouncedSetSearch(val);
    };

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    // Типізуємо відповідь, наприклад:
    interface NotesResponse {
        notes: Note[];
        totalPages: number;
    }

    const { data, isLoading, error } = useQuery<NotesResponse>(
        ['notes', page, debouncedSearch],
        () => fetchNotes(page, debouncedSearch),
        { keepPreviousData: true }
    );

    const createMutation = useMutation<Note, Error, NoteCreate>({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
            setIsModalOpen(false);
        },
    });

    const updateMutation = useMutation<Note, Error, { id: number; data: NoteUpdate }>({
        mutationFn: ({ id, data }) => updateNote(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
            setIsModalOpen(false);
        },
    });

    const deleteMutation = useMutation<void, Error, number>({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
        },
    });

    const openCreateModal = () => {
        setModalVariant('CREATE');
        setCurrentNote(null);
        setIsModalOpen(true);
    };

    const openEditModal = (note: Note) => {
        setModalVariant('UPDATE');
        setCurrentNote(note);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentNote(null);
    };

    const handleSubmit = (values: NoteCreate | NoteUpdate) => {
        if (modalVariant === 'CREATE') {
            createMutation.mutate(values as NoteCreate);
        } else if (modalVariant === 'UPDATE' && currentNote) {
            updateMutation.mutate({ id: currentNote.id, data: values as NoteUpdate });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this note?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div>
            <header>
                <SearchBox onSearch={onSearch} /* value={searchTerm} — якщо SearchBox підтримує цей пропс */ />
                <button onClick={openCreateModal}>Create note +</button>
            </header>

            {error && <p>Error loading notes</p>}

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <NoteList notes={data?.notes ?? []} onEdit={openEditModal} onDelete={handleDelete} />
            )}

            {data?.totalPages && data.totalPages > 1 && (
                <Pagination totalPages={data.totalPages} currentPage={page} onPageChange={setPage} />
            )}

            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <NoteForm variant={modalVariant} note={currentNote} onClose={closeModal} onSubmit={handleSubmit} />
                </Modal>
            )}
        </div>
    );
};

export default App;