import { useQuery } from "@tanstack/react-query";
import * as noteService from '../services/noteService.ts'

export const useNote = (id: number) => {
    return useQuery({
        queryKey: ['notes', { id }],
        queryFn: () => noteService.getById(id)
    })
}