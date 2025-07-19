import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Paginaition from '../Pagination/Pagination';
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

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['notes', page, search],
        queryFn: () => fetchNotes({
            page: 1,
            perPage: 12,
            ...(search.trim() ? { search: search.trim() } : {})
        }),
        placeholderData: keepPreviousData
    }
    );

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={search} onSearch={setSearch} />
                {isLoading && <Loader />}
                {isError && <ErrorMessage />}
                {data && data.total_pages > 1 && (
                    <Paginaition
                        currentPage={page}
                        totalPages={data.total_pages}
                        onPageChange={setPage}
                    />
                )}
                <button className={css.button} type='button' onClick={() => setModalIsOpen(true)}>Create +</button>
            </header>
            {isSuccess && data?.data?.length > 0 ? (
                <NoteList notes={data.data} />)
                : (
                    <p>No notes found</p>
                )
            }
            {modalIsOpen && (
                <Modal onClose={() => setModalIsOpen(false)}>
                    <NoteForm onClose={() => setModalIsOpen(false)} />
                </Modal>
            )}
        </div>
    );
};