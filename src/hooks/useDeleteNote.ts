import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as noteService from '../services/noteService';
import toast from "react-hot-toast";

export const useDeleteNote = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: (id) => noteService.deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};