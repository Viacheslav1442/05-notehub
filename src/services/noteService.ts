import axios from "axios";
import toast from "react-hot-toast";
import type { Note, NoteCreate, NoteUpdate } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";


const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!myKey) {
    toast.error("VITE_NOTEHUB_TOKEN is not defined");
} else {
    axios.defaults.headers.common['Authorization'] = `Bearer ${myKey}`;
}


export interface FetchNotesParams {
    page?: number;
    perPage?: number;
    search?: string;
}


export interface FetchNotesResponse {
    page: number;
    perPage: number;
    data: Note[];
    totalPages: number;
}

interface RawFetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async ({
    page = 1,
    perPage = 12,
    search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
    const response = await axios.get<RawFetchNotesResponse>('/notes', {
        params: {
            page,
            perPage,
            ...(search ? { search } : {}),
        },
    });

    return {
        page,
        perPage,
        data: response.data.notes,
        totalPages: response.data.totalPages,
    };
};

export const createNote = async (note: NoteCreate): Promise<Note> => {
    const response = await axios.post<Note>('/notes', note);
    return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
    const response = await axios.delete<Note>(`/notes/${id}`);
    return response.data;
};

export const updateNote = async (id: number, updates: NoteUpdate): Promise<Note> => {
    const response = await axios.patch<Note>(`/notes/${id}`, updates);
    return response.data;
};