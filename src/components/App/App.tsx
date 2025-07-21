import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../Error/Error';
import css from '../App/App.module.css';

export default function App() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);


    const [debouncedSearch] = useDebounce(search, 500);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);


    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['notes', page, debouncedSearch],
        queryFn: () =>
            fetchNotes({
                page,
                perPage: 12,
                ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
            }),
        placeholderData: keepPreviousData,
    });

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={search} onSearch={setSearch} />

                {isLoading && <Loader />}
                {isError && <ErrorMessage />}

                {data && data.totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                    />
                )}

                <button
                    className={css.button}
                    type="button"
                    onClick={() => setModalIsOpen(true)}
                >
                    Create +
                </button>
            </header>

            {isSuccess && data?.data?.length > 0 ? (
                <NoteList notes={data.data} />
            ) : (
                !isLoading && <p>No notes found</p>
            )}

            {modalIsOpen && (
                <Modal onClose={() => setModalIsOpen(false)}>
                    <NoteForm onClose={() => setModalIsOpen(false)} />
                </Modal>
            )}
        </div>
    );
}