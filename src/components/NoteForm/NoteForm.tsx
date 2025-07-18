import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Note, NoteCreate, NoteUpdate } from "../../types/note";
import { ModalVariant } from "../../enums";
import css from "./NoteForm.module.css";
import axios from "axios";

export interface NoteFormProps {
    onClose: () => void;
    note: Note | null;
    variant: ModalVariant;
}

type FieldName = "title" | "content" | "tag";

interface InitialValues {
    title: string;
    content: string;
    tag: string;
}

const fixedTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const NoteForm = ({ onClose, note, variant }: NoteFormProps) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (note: NoteCreate) =>
            axios.post<Note>(
                "https://notehub-public.goit.study/api/notes",
                note,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
                    },
                }
            ).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note created");
            onClose();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: NoteUpdate }) =>
            axios.patch<Note>(
                `https://notehub-public.goit.study/api/notes/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
                    },
                }
            ).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note updated");
            onClose();
        },
    });

    const schema = Yup.object({
        title: Yup.string()
            .min(3, "Title must be at least 3 characters")
            .max(50, "Title must be max 50 characters")
            .required("Title is required"),
        content: Yup.string().max(500, "Content must be max 500 characters"),
        tag: Yup.string()
            .oneOf(fixedTags, "Please choose a valid tag")
            .required("Tag is required"),
    });

    const formik = useFormik<InitialValues>({
        initialValues: {
            title: note?.title ?? "",
            content: note?.content ?? "",
            tag: note?.tag ?? fixedTags[0],
        },
        validationSchema: schema,
        onSubmit: (values, helpers) => {
            if (variant === ModalVariant.UPDATE && note) {
                updateMutation.mutate({ id: note.id, data: values });
            } else {
                createMutation.mutate(values);
            }

            helpers.resetForm();
        },
    });

    const handleCheckError = (fieldName: FieldName) => {
        return formik.touched[fieldName] && formik.errors[fieldName];
    };

    return (
        <form className={css.form} onSubmit={formik.handleSubmit}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={css.input}
                />
                <ErrorMessage
                    name="title"
                    component="span"
                    className={css.error}
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows={8}
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={css.textarea}
                />
                <ErrorMessage
                    name="content"
                    component="span"
                    className={css.error}
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    value={formik.values.tag}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={css.select}
                >
                    {fixedTags.map(tag => (
                        <option value={tag} key={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
                <ErrorMessage
                    name="tag"
                    component="span"
                    className={css.error}
                />
            </div>

            <div className={css.actions}>
                <button
                    type="button"
                    onClick={onClose}
                    className={css.cancelButton}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={createMutation.isPending || updateMutation.isPending}
                >
                    {variant === ModalVariant.CREATE ? "Create note" : "Update note"}
                </button>
            </div>
        </form>
    );
};

export default NoteForm;