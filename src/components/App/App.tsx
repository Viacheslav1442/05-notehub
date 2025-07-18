import { useEffect, useState } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Error from '../Error/Error';
import Pagination from '../Pagination/Pagination';
import { useNotes } from '../../hooks/useNotes';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import NoteModal from '../Modal/Modal';
import { useQueryClient } from '@tanstack/react-query';

function App() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useNotes({ search, page });

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ['notes', { search, page }],
        });
    }, [search, page, queryClient]);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1); // Повертаємося на першу сторінку після пошуку
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleNoteClick = (id: number) => {
        setSelectedNoteId(id);
    };

    const closeModal = () => {
        setSelectedNoteId(null);
    };

    if (isLoading) return <Loader />;
    if (isError || !data) return <Error message="Something went wrong" />;

    return (
        <div className={css.container}>
            <SearchBox onSearch={handleSearch} />
            <NoteList notes={data.notes} onNoteClick={handleNoteClick} />
            <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
            />
            {selectedNoteId !== null && (
                <NoteModal noteId={selectedNoteId} onClose={closeModal} />
            )}
        </div>
    );
}

export default App;