import { useFormik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { Note, NoteCreate, NoteUpdate } from '../../types/note';

interface NoteFormProps {
    variant: 'CREATE' | 'UPDATE';
    note?: Note | null;
    onClose: () => void;
    onSubmit: (values: NoteCreate | NoteUpdate) => void;
}

const TAG_OPTIONS = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

const NoteForm = ({ variant, note, onClose, onSubmit }: NoteFormProps) => {
    const formik = useFormik({
        initialValues: {
            title: note?.title || '',
            content: note?.content || '',
            tag: note?.tag || 'Todo',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            content: Yup.string(),
            tag: Yup.mixed().oneOf(TAG_OPTIONS).required('Tag is required'),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <label>
                Title
                <input
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                />
                <ErrorMessage name="title" component="div" />
            </label>

            <label>
                Content
                <textarea
                    name="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <ErrorMessage name="content" component="div" />
            </label>

            <label>
                Tag
                <select
                    name="tag"
                    value={formik.values.tag}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    {TAG_OPTIONS.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
                <ErrorMessage name="tag" component="div" />
            </label>

            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{variant === 'CREATE' ? 'Create' : 'Update'}</button>
        </form>
    );
};

export default NoteForm;
