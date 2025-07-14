import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note, NoteUpdate } from "../types/note.ts";
import * as noteService from "../services/noteService.ts";
import toast from "react-hot-toast";

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation<Note, Error, { id: number; data: NoteUpdate }>({
        mutationFn: ({ id, data }: { id: number; data: NoteUpdate }) =>
            noteService.updateById(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};