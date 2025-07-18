import css from './NoteForm.module.css';
import { useFormik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { NoteCreate, NoteUpdate } from '../../types/note';

const TAG_OPTIONS = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;
type TagType = typeof TAG_OPTIONS[number];

interface NoteFormProps {
    variant: 'CREATE' | 'UPDATE';
    note?: (NoteCreate & { tag: TagType }) | null;
    onClose: () => void;
    onSubmit: (values: NoteCreate | NoteUpdate) => void;
    tags: readonly TagType[];
}

const NoteForm = ({ variant, note, onClose, onSubmit, tags }: NoteFormProps) => {
    const formik = useFormik<NoteCreate | NoteUpdate>({
        initialValues: {
            title: note?.title || '',
            content: note?.content || '',
            tag: (note?.tag || 'Todo') as TagType,
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            content: Yup.string(), // content необов’язковий
            tag: Yup.mixed<TagType>().oneOf(TAG_OPTIONS).required('Tag is required'),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className={css.form}>
            <label className={css.label}>
                Title
                <input
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    className={css.input}
                />
                <ErrorMessage name="title" component="div" className={css.error} />
            </label>

            <label className={css.label}>
                Content
                <textarea
                    name="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={css.textarea}
                />
                <ErrorMessage name="content" component="div" className={css.error} />
            </label>

            <label className={css.label}>
                Tag
                <select
                    name="tag"
                    value={formik.values.tag}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={css.select}
                >
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
                <ErrorMessage name="tag" component="div" className={css.error} />
            </label>

            <div className={css.buttons}>
                <button type="button" onClick={onClose} className={css.buttonCancel}>
                    Cancel
                </button>
                <button type="submit" className={css.buttonSubmit}>
                    {variant === 'CREATE' ? 'Create' : 'Update'}
                </button>
            </div>
        </form>
    );
};

export default NoteForm;