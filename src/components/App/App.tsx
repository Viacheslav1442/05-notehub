import { useEffect, useState } from "react";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import Error from "../Error/Error";
import Pagination from "../Pagination/Pagination";
import { useNotes } from "../../hooks/useNotes";
import NoteList from "../NoteList/NoteList";
import Loader from "../Loader/Loader";
import NoteModal from "../Modal/Modal";
import { Note } from "../../types/note";
import { ModalVariant } from "../../types/modal";

const App = () => {
    const [page, setPage] = useState(1);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [variant, setVariant] = useState<ModalVariant>("CREATE");
    const [tags, setTags] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isError } = useNotes(page);

    useEffect(() => {
        if (!data) return;
        const allTags = data.results
            .flatMap((note: Note) => note.tags || [])
            .filter((tag: unknown): tag is string => typeof tag === "string");

        const uniqueTags = [...new Set(allTags)];
        setTags(uniqueTags);
    }, [data]);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedNote(null);
    };

    const handleNoteClick = (note: Note) => {
        setSelectedNote(note);
        setVariant("UPDATE");
        setIsModalOpen(true);
    };

    return (
        <div className={css.wrapper}>
            <SearchBox />
            {isLoading && <Loader />}
            {isError && <Error />}
            {data && (
                <>
                    <NoteList notes={data.results} onNoteClick={handleNoteClick} />
                    <Pagination
                        page={page}
                        onChangePage={setPage}
                        totalPages={data.total_pages}
                    />
                </>
            )}
            {isModalOpen && (
                <NoteModal
                    variant={variant}
                    onClose={handleModalClose}
                    note={selectedNote}
                    tags={tags}
                />
            )}
        </div>
    );
};

export default App;