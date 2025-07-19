import axios from 'axios';
import type { Note, NoteCreate, NoteUpdate } from '../types/note';

const instance = axios.create({
    baseURL: 'https://notehub-public.goit.study/api',
    headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}` },
});

interface NoteHubResponse {
    notes: Note[];
    totalPages: number;
}

interface NoteHubSearchParams {
    params: {
        search?: string;
        page: number;
        perPage: number;
    };
}

export async function fetchNotes(
    page: number,
    search: string
): Promise<{ notes: Note[]; totalPages: number }> {
    const noteHubSearchParams: NoteHubSearchParams = {
        params: {
            page,
            perPage: 12,
        },
    };
    if (search.trim() !== "") {
        noteHubSearchParams.params.search = search.trim();
    }
    const response = await axios.get<NoteHubResponse>(
        "https://notehub-public.goit.study/api/notes/",
        noteHubSearchParams
    );

    return response.data;
}

export const createNote = (data: NoteCreate): Promise<Note> => {
    return instance.post<Note>('/notes', data).then(res => res.data);
};

export const updateNote = (id: number, data: NoteUpdate): Promise<Note> => {
    return instance.put<Note>(`/notes/${id}`, data).then(res => res.data);
};

export const deleteNote = (id: number): Promise<void> => {
    return instance.delete<void>(`/notes/${id}`).then(() => { });
};

export const fetchNoteById = async (id: number): Promise<Note> => {
    const response = await instance.get<Note>(`/notes/${id}`);
    return response.data;
};