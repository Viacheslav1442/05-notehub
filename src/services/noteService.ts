import axios from 'axios';
import type { Note, NoteCreate, NoteUpdate } from '../types/note';

const instance = axios.create({
    baseURL: 'https://your.api.url/',
    headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}` },
});


export const fetchNotes = (page: number, search: string): Promise<{ notes: Note[]; totalPages: number }> => {
    return instance.get('/notes', { params: { page, search } }).then(res => res.data);
};

export const createNote = (data: NoteCreate): Promise<Note> => {
    return instance.post('/notes', data).then(res => res.data);
};

export const updateNote = (id: number, data: NoteUpdate): Promise<Note> => {
    return instance.put(`/notes/${id}`, data).then(res => res.data);
};

export const deleteNote = (id: number): Promise<void> => {
    return instance.delete(`/notes/${id}`).then(() => { });
};
export const fetchNoteById = async (id: number): Promise<Note> => {
    const response = await axios.get<Note>(`/api/notes/${id}`);
    return response.data;
};