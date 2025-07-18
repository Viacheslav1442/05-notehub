import axios from 'axios';
import type { NoteCreate, NoteUpdate, Note } from '../types/note';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
    },
});

export const fetchNotes = (page: number, query: string) =>
    instance.get<Note>('/notes', { params: { page, query } }).then(res => res.data);

export const createNote = (note: NoteCreate) =>
    instance.post<Note>('/notes', note).then(res => res.data);

export const updateNote = (id: number, note: NoteUpdate) =>
    instance.put<Note>(`/notes/${id}`, note).then(res => res.data);

export const deleteNote = (id: number) =>
    instance.delete<void>(`/notes/${id}`).then(res => res.data);