import { Sorting } from "../enums";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as noteService from '../services/noteService.ts'

export const useNotes = (page: number = 1, query?: string, sorting: Sorting = Sorting.UPDATED, limit: number = 10) => {
    return useQuery({
        queryKey: ['notes', { page, sorting, query, limit }],
        queryFn: () => noteService.getAll(page, query, sorting, limit),
        placeholderData: keepPreviousData
    })
}