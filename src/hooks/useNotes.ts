import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../services/noteService";
import type { FetchNotesResponse } from "../services/noteService";

export const useNotes = (page: number, query: string) => {
    return useQuery<FetchNotesResponse>({
        queryKey: ["notes", page, query],
        queryFn: () => fetchNotes(page, query),
    });
};