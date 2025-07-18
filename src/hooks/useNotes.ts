import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../services/noteService";
import type { Note, } from "../types/note";

type NotesResponse = {
    notes: Note[];
    totalPages: number;
};

export const useNotes = (page: number, query: string) => {
    return useQuery<NotesResponse>({
        queryKey: ['notes', page, query],
        queryFn: () => fetchNotes(page, query),
    });
};