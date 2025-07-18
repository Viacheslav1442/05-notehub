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
import { ModalVariant } from "../../enums";

function App() {
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>("");
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);
    const [modalVariant, setModalVariant] = useState<ModalVariant>(
        ModalVariant.CREATE
    );

    const { data, isLoading, error } = useNotes({ search: query, page });

    useEffect(() => {
        setPage(1);
    }, [query]);

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

    const onOpen = (note: Note) => {
        setCurrentNote(note);
        setIsOpenModal(true);
    };

    const onSearch = (searchValue: string) => {
        setQuery(searchValue);
    };

    const onModalVariant = (variant: ModalVariant) => {
        setModalVariant(variant);
    };

    const onClickCreateBtn = () => {
        setCurrentNote(null);
        onModalVariant(ModalVariant.CREATE);
        setIsOpenModal(true);
    };

    const handleNoteClick = (id: number) => {
        const note = data?.notes.find((n) => n.id === id) ?? null;
        if (note) {
            setCurrentNote(note);
            setIsOpenModal(true);
            onModalVariant(ModalVariant.UPDATE);
        }
    };

    if (error) {
        return (
            <div className={css.app}>
                <div className={`${css.container} ${css.header_container}`}>
                    <header className={`${css.toolbar}`}>
                        <SearchBox onSearch={onSearch} />
                        {data && data.totalPages > 1 && (
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
                    {data && data.totalPages > 1 && (
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
                <NoteList notes={data?.notes ?? []} onNoteClick={handleNoteClick} />
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