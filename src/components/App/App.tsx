import { useEffect, useState } from "react";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import Error from "../Error/Error";
import Pagination from "../Pagination/Pagination";
import { useNotes } from "../../hooks/useNotes";
import NoteList from "../NoteList/NoteList";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import type { Note } from "../../types/note";
import toast from "react-hot-toast";

type ModalVariant = "CREATE" | "UPDATE";

const DEFAULT_TAGS = ['Todo', 'Personal', 'Work'];

function App() {
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>("");
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);
    const [modalVariant, setModalVariant] = useState<ModalVariant>("CREATE");

    const onClose = () => {
        setCurrentNote(null);
        setIsOpenModal(false);
    };

    const onOpen = (note: Note) => {
        setCurrentNote(note);
        setIsOpenModal(true);
    };

    const onSearch = (searchQuery: string) => {
        setQuery(searchQuery);
    };

    const onModalVariant = (variant: ModalVariant) => {
        setModalVariant(variant);
    };

    const onClickCreateBtn = () => {
        setIsOpenModal(true);
        onModalVariant("CREATE");
    };

    const { data, isLoading, error } = useNotes(page, query);

    useEffect(() => {
        setPage(1);
    }, [query]);

    useEffect(() => {
        if (!data || !Array.isArray(data.notes)) return;

        if (data.notes.length === 0) {
            toast.error("There is no data");
        }


        const fetchedTags: string[] = data.notes.map(note => note.tag);
        const uniqueTags = Array.from(new Set<string>(fetchedTags));
        const combinedTags = Array.from(new Set<string>([...DEFAULT_TAGS, ...uniqueTags]));
        setTags(combinedTags);
    }, [data]);

    const totalPages = data?.totalPages ?? 0;

    if (error) {
        return (
            <div className={css.app}>
                <div className={`${css.container} ${css.header_container}`}>
                    <header className={css.toolbar}>
                        <SearchBox onSearch={onSearch} />
                        {totalPages > 0 && (
                            <Pagination
                                page={page}
                                setPage={setPage}
                                totalPages={totalPages}
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
                <header className={css.toolbar}>
                    <SearchBox onSearch={onSearch} />
                    {totalPages > 1 && (
                        <Pagination
                            page={page}
                            onChangePage={setPage}
                            totalPages={totalPages}
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
                <NoteList
                    notes={Array.isArray(data?.notes) ? data.notes : []}
                    setCurrentNote={onOpen}
                    setVariant={onModalVariant}
                />
            )}
            {isOpenModal && (
                <Modal onClose={onClose}>
                    <NoteForm
                        variant={modalVariant}
                        onClose={onClose}
                        note={currentNote}
                        tags={tags}
                    />
                </Modal>
            )}
        </div>
    );
}

export default App;