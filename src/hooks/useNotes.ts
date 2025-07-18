import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../services/noteService';
import type { Note } from '../types/note';

interface NotesResponse {
    notes: Note[];
    totalPages: number;
}

interface UseNotesParams {
    search: string;
    page: number;
}

export function useNotes({ search, page }: UseNotesParams) {
    return useQuery<NotesResponse>({
        queryKey: ['notes', page, search],
        queryFn: () => fetchNotes(page, search),
    });
}