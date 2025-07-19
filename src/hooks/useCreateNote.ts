import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as noteService from '../services/noteService';
import type { Note } from '../types/note';
import toast from "react-hot-toast";

export const useCreateNote = () => {
    const queryClient = useQueryClient();

    return useMutation<Note, Error, NoteCreate>({
        mutationFn: (data) => noteService.createNote(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};