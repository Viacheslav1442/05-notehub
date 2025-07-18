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

    // Скидаємо сторінку на 1 при зміні debouncedSearch
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);


    const { data, isLoading, error } = useQuery(
        ['notes', page, debouncedSearch],
        () => fetchNotes(page, debouncedSearch),
    );

    // Мутації для створення, оновлення і видалення нотаток
    const createMutation = useMutation(createNote, {
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
            setIsModalOpen(false);
        },
    });

    const updateMutation = useMutation(
        ({ id, data }: { id: number; data: NoteUpdate }) => updateNote(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['notes']);
                setIsModalOpen(false);
            },
        }
    );

    const deleteMutation = useMutation(deleteNote, {
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
        },
    });

    // Відкриття модалки для створення нотатки
    const openCreateModal = () => {
        setModalVariant('CREATE');
        setCurrentNote(null);
        setIsModalOpen(true);
    };

    // Відкриття модалки для редагування нотатки
    const openEditModal = (note: Note) => {
        setModalVariant('UPDATE');
        setCurrentNote(note);
        setIsModalOpen(true);
    };

    // Закриття модалки
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentNote(null);
    };

    // Обробка відправлення форми
    const handleSubmit = (values: NoteCreate | NoteUpdate) => {
        if (modalVariant === 'CREATE') {
            createMutation.mutate(values as NoteCreate);
        } else if (modalVariant === 'UPDATE' && currentNote) {
            updateMutation.mutate({ id: currentNote.id, data: values as NoteUpdate });
        }
    };

    // Видалення нотатки з підтвердженням
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this note?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div>
            <header>
                <SearchBox onSearch={onSearch} value={searchTerm} />
                <button onClick={openCreateModal}>Create note +</button>
            </header>

            {error && <p>Error loading notes</p>}

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <NoteList notes={data?.notes || []} onEdit={openEditModal} onDelete={handleDelete} />
            )}

            {data?.totalPages > 1 && (
                <Pagination totalPages={data.totalPages} currentPage={page} onPageChange={setPage} />
            )}

            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <NoteForm
                        variant={modalVariant}
                        note={currentNote}
                        onClose={closeModal}
                        onSubmit={handleSubmit}
                    />
                </Modal>
            )}
        </div>
    );
};

export default App;