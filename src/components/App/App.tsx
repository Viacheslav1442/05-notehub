import { useEffect, useState } from "react";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox.tsx";
import Error from "../Error/Error.tsx";
import Pagination from "../Pagination/Pagination.tsx";
import { useNotes } from "../../hooks/useNotes.ts";
import NoteList from "../NoteList/NoteList.tsx";
import Loader from "../Loader/Loader.tsx";
import NoteModal from "../NoteModal/NoteModal.tsx";
import NoteForm from "../NoteForm/NoteForm.tsx";
import type { Note } from "../../types/note.ts";
import toast from "react-hot-toast";
import { ModalVariant } from "../../enums";

function App() {
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>("");
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);
    const [modalVariant, setModalVariant] = useState<ModalVariant>(
        ModalVariant.CREATE,
    );

    const onClose = () => {
        setCurrentNote(null);
        setIsOpenModal(false);
    };

    const onOpen = (note: Note) => {
        setCurrentNote(note);
        setIsOpenModal(true);
    };

    const onSearch = (query: string) => {
        setQuery(query);
    };

    const onModalVariant = (variant: ModalVariant) => {
        setModalVariant(variant);
    };

    const onClickCreateBtn = () => {
        setIsOpenModal(true);
        onModalVariant(ModalVariant.CREATE);
    };

    const { data, isLoading, error } = useNotes(page, query);

    useEffect(() => {
        setPage(1);
    }, [query]);

    useEffect(() => {
        if (!data) return;

        if (Array.isArray(data.notes) && data.notes.length === 0) {
            toast.error("There is no data");
        }

        const tags = data.notes.map(note => note.tag);
        setTags(Array.from(new Set(tags)));
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
                            setPage={setPage}
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
                    setCurrentNote={onOpen}
                    setVariant={onModalVariant}
                    notes={Array.isArray(data?.notes) ? data.notes : []}
                />
            )}
            {isOpenModal && (
                <NoteModal onClose={onClose}>
                    <NoteForm
                        variant={modalVariant}
                        onClose={onClose}
                        note={currentNote}
                        tags={tags}
                    />
                </NoteModal>
            )}
        </div>
    );
}

export default App;