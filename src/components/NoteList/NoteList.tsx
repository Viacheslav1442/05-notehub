import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";
import toast from "react-hot-toast";
import type { ModalVariant } from "../../enums";
import axios from "axios";

export interface NoteListProps {
    notes?: Note[];
    setCurrentNote: (note: Note) => void;
    setVariant: (variant: ModalVariant) => void;
}

const NoteList = ({
    notes = [],
    setCurrentNote,
    setVariant,
}: NoteListProps) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            axios
                .delete<Note>(`https://notehub-public.goit.study/api/notes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
                    },
                })
                .then((res) => res.data),
        onSuccess: () => {
            toast.success("Note deleted");
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
        onError: () => {
            toast.error("Failed to delete note");
        },
    });

    const handleDelete = (id: number) => {
        deleteMutation.mutate(String(id));
    };

    return (
        <ul className={`${css.list} container`}>
            {notes.length > 0 ? (
                notes.map((note) => (
                    <li key={note.id} className={css.item}>
                        <h3 className={css.title}>{note.title}</h3>
                        <p className={css.content}>{note.content}</p>
                        <p className={css.tag}>Tag: {note.tag}</p>

                        <div className={css.actions}>
                            <button
                                onClick={() => {
                                    setCurrentNote(note);
                                    setVariant("UPDATE");
                                }}
                                className={css.editButton}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(note.id)}
                                className={css.deleteButton}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))
            ) : (
                <p className={css.empty}>No notes found</p>
            )}
        </ul>
    );
};

export default NoteList;