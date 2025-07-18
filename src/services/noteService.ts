import axios from 'axios';
import type { Note, NoteUpdate } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api/notes';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
    },
});

export interface NoteResponseAll {
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async (
    page: number,
    search?: string
): Promise<NoteResponseAll> => {
    const params: Record<string, string | number> = {
        page,
        perPage: 12,
    };

    if (search && search.trim()) {
        params.search = search.trim();
    }

    const { data } = await instance.get<NoteResponseAll>('', { params });
    return data;
};

export const createNote = async (
    note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note> => {
    const { data } = await instance.post<Note>('', note);
    return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
    const { data } = await instance.delete<Note>(`/${id}`);
    return data;
};

export const getById = async (id: string): Promise<Note> => {
    const { data } = await instance.get<Note>(`/${id}`);
    return data;
};

export const updateById = async (
    id: number,
    update: NoteUpdate
): Promise<Note> => {
    const { data } = await instance.patch<Note>(`/${id}`, update);
    return data;
};