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
import type { Note, NoteCreate, NoteUpdate } from "../../types/note.ts";
import toast from "react-hot-toast";

type Variant = "CREATE" | "UPDATE";

// Фіксований набір тегів (має співпадати з NoteForm і типами тегів)
const TAG_OPTIONS = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;
type TagType = typeof TAG_OPTIONS[number];

function App() {
    const [page, setPage] = useState<number>(1);
    const [searchInput, setSearchInput] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [modalVariant, setModalVariant] = useState<Variant>("CREATE");

    // Використовуємо фіксований набір тегів
    const [tags] = useState<readonly TagType[]>(TAG_OPTIONS);

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
    }, [data]);

    const onClose = () => {
        setCurrentNote(null);
        setIsOpenModal(false);
    };

    const onSearch = (newQuery: string) => {
        setSearchInput(newQuery);
    };

    const onClickCreateBtn = () => {
        setCurrentNote(null);
        setIsOpenModal(true);
        setModalVariant("CREATE");
    };

    const handleSubmit = (_values: NoteCreate | NoteUpdate) => {
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
                        setCurrentNote={(note: Note) => {
                            setCurrentNote(note);
                            setIsOpenModal(true);
                            setModalVariant("UPDATE");
                        }}
                        setVariant={setModalVariant}
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