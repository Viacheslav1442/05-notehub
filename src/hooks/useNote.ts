import { useQuery } from '@tanstack/react-query';
import * as noteService from '../services/noteService';

export const useNote = (id?: number | null) => {
    return useQuery({
        queryKey: ['note', id],
        queryFn: () => noteService.fetchNoteById(id!),
        enabled: Boolean(id),
    });
};