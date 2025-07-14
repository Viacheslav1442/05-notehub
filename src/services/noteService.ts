import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api/notes';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
    },
});

export interface FetchNotesResponse {
    data: Note[];
    page: number;
    perPage: number;
    totalPages: number;
}

export const fetchNotes = async (
    page: number,
    search: string
): Promise<FetchNotesResponse> => {
    const { data } = await instance.get('', {
        params: {
            page,
            perPage: 12,
            search,
        },
    });
    return data;
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
