import css from "./NoteForm.module.css";
import type { Note } from "../../types/note.ts";
import { type FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateNote } from "../../hooks/useUpdateNote.ts";
import { useCreateNote } from "../../hooks/useCreateNote.ts";
import { ModalVariant } from "../../enums";
import toast from "react-hot-toast";

export interface NoteFormProps {
    onClose: () => void;
    note: Note | null;
    tags: string[];
    variant: string;
}

type FieldName = "title" | "content" | "tag";

interface InitialValues {
    title: string;
    content: string;
    tag: string;
}

const NoteForm = ({ onClose, note, tags, variant }: NoteFormProps) => {
    const createNote = useCreateNote();
    const updateNote = useUpdateNote();
    const handleSubmit = (
        values: InitialValues,
        helpers: FormikHelpers<InitialValues>,
    ) => {
        switch (variant) {
            case ModalVariant.CREATE:
                createNote.mutate(values, {
                    onSuccess: () => {
                        helpers.resetForm();
                        onClose();
                    },
                });
                return;
            case ModalVariant.UPDATE:
                if (!note) {
                    toast.error("Note is NULL can't update");
                    break;
                }
                updateNote.mutate(
                    { id: note.id, data: values },
                    {
                        onSuccess: () => {
                            helpers.resetForm();
                            onClose();
                        },
                    },
                );
                return;
            default:
                createNote.mutate(values, {
                    onSuccess: () => {
                        helpers.resetForm();
                        onClose();
                    },
                });
                return;
        }
    };

    const schema = Yup.object({
        title: Yup.string()
            .min(3, "Title must be at least 2 characters")
            .max(50, "Title must be max 50 characters")
            .required("Title is required"),
        content: Yup.string()
            .max(500, "Content must be max 500 characters")
            .required("Content is required"),
        tag: Yup.string()
            .oneOf(tags, "Please choose a valid tag")
            .required("Tag is required"),
    });

    const formik = useFormik<InitialValues>({
        initialValues: {
            title: note?.title ?? "",
            content: note?.content ?? "",
            tag: note?.tag || tags[0] || "",
        },
        validationSchema: schema,
        onSubmit: handleSubmit,
    });
    const handleCheckError = (fieldName: FieldName) => {
        if (formik.errors[fieldName]) {
            return formik.errors[fieldName];
        }
        return "";
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
                    className={css.input}
                />
                <span className={css.error}>{handleCheckError("title")}</span>
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows={8}
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    className={css.textarea}
                />
                <span className={css.error}>{handleCheckError("content")}</span>
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    value={formik.values.tag}
                    onChange={formik.handleChange}
                    disabled={!tags.length}
                    className={css.select}
                >
                    {tags.map((tag) => (
                        <option value={tag} key={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
                <span className={css.error}>{handleCheckError("tag")}</span>
            </div>

            <div className={css.actions}>
                <button onClick={onClose} type="button" className={css.cancelButton}>
                    Cancel
                </button>
                <button type="submit" className={css.submitButton} disabled={false}>
                    Create note
                </button>
            </div>
        </form>
    );
};

export default NoteForm;