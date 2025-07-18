import { useEffect, useState } from "react";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox.tsx";
import Error from "../Error/Error.tsx";
import Pagination from "../Pagination/Pagination.tsx";
import { useNotes } from "../../hooks/useNotes.ts";
import NoteList from "../NoteList/NoteList.tsx";
import Loader from "../Loader/Loader.tsx";
import NoteModal from "../Modal/Modal.tsx";
import NoteForm from "../NoteForm/NoteForm.tsx";
import type { Note } from "../../types/note.ts";
import toast from "react-hot-toast";

type Variant = "CREATE" | "UPDATE";

function App() {
    const [page, setPage] = useState<number>(1);
    const [searchInput, setSearchInput] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);
    const [modalVariant, setModalVariant] = useState<Variant>("CREATE");


    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchInput]);

    const { data, isLoading, error } = useNotes({ search: query, page });

    useEffect(() => {
        if (!data) return;

        if (Array.isArray(data.notes) && data.notes.length === 0) {
            toast.error("There is no data");
        }

        setTags([...new Set(data.notes.map((note) => note.tag))]);
    }, [data]);

    const onClose = () => {
        setCurrentNote(null);
        setIsOpenModal(false);
    };

    const handleNoteClick = (note: Note) => {
        setCurrentNote(note);
        setIsOpenModal(true);
        setModalVariant("UPDATE");
    };

    const onSearch = (newQuery: string) => {
        setSearchInput(newQuery);
    };

    const onClickCreateBtn = () => {
        setCurrentNote(null);
        setIsOpenModal(true);
        setModalVariant("CREATE");
    };

    const handleSubmit = () => {
        onClose();
        toast.success(
            modalVariant === "CREATE"
                ? "Note created successfully"
                : "Note updated successfully"
        );
    };

    if (error) {
        return (
            <div className={css.app}>
                <div className={`${css.container} ${css.header_container}`}>
                    <header className={`${css.toolbar}`}>
                        <SearchBox onSearch={onSearch} />
                        {data && data.totalPages && (
                            <Pagination
                                currentPage={page}
                                onPageChange={setPage}
                                totalPages={data.totalPages}
                            />
                        )}
                        <button onClick={onClickCreateBtn} className={css.button}>
                            Create note +
                        </button>
                    </header>
                </div>
                <Error message={"404 Not Found"} />
            </div>
        );
    }

    return (
        <div className={css.app}>
            <div className={`${css.container} ${css.header_container}`}>
                <header className={`${css.toolbar}`}>
                    <SearchBox onSearch={onSearch} />
                    {data?.totalPages && data.totalPages > 1 && (
                        <Pagination
                            currentPage={page}
                            onPageChange={setPage}
                            totalPages={data.totalPages}
                        />
                    )}
                    <button onClick={onClickCreateBtn} className={css.button}>
                        Create note +
                    </button>
                </header>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                data && (
                    <NoteList
                        notes={data.notes}
                        onNoteClick={(id) => {
                            const note = data.notes.find((n) => n.id === id);
                            if (note) handleNoteClick(note);
                        }}
                    />
                )
            )}
            {isOpenModal && (
                <NoteModal onClose={onClose}>
                    <NoteForm
                        variant={modalVariant}
                        onClose={onClose}
                        note={currentNote}
                        tags={tags}
                        onSubmit={handleSubmit}
                    />
                </NoteModal>
            )}
        </div>
    );
}

export default App;