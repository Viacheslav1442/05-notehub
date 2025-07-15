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
    search: string
): Promise<NoteResponseAll> => {
    const params: Record<string, string | number> = {
        page,
        perPage: 12,
    };

    if (search.trim()) {
        params.search = search.trim();
    }

    const { data } = await instance.get('', { params });

    return {
        notes: data.data,
        totalPages: data.totalPages,
    };
};

export const createNote = async (note: {
    title: string;
    content: string;
    tag: string;
}): Promise<Note> => {
    const { data } = await instance.post('', note);
    return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
    const { data } = await instance.delete(`/${id}`);
    return data;
};

export const getById = async (id: string): Promise<Note> => {
    const { data } = await instance.get(`/${id}`);
    return data;
};

export const updateById = async (id: number, data: NoteUpdate): Promise<Note> => {
    const response = await instance.patch(`/${id}`, data);
    return response.data;
};