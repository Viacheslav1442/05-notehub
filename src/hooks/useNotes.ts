import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../services/noteService";
import type { NoteResponseAll } from "../types/note";

export const useNotes = (page: number, query: string) => {
    return useQuery<NoteResponseAll>({
        queryKey: ["notes", page, query],
        queryFn: () => fetchNotes(page, query),
    });
};