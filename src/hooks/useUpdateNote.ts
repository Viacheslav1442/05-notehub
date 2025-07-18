import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note, NoteUpdate } from "../types/note";
import * as noteService from "../services/noteService";
import toast from "react-hot-toast";

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation<Note, Error, { id: number; data: NoteUpdate }>({
        mutationFn: ({ id, data }) => noteService.updateNote(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};