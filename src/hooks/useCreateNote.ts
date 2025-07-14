import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as noteService from "../services/noteService.ts";
import type { Note, NoteCreate } from "../types/note.ts";
import toast from "react-hot-toast";

export const useCreateNote = () => {
    const queryClient = useQueryClient();

    return useMutation<Note, Error, NoteCreate>({
        mutationFn: (data: NoteCreate) => noteService.createNote(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};