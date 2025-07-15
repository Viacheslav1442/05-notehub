import type {
    Note,
    NoteCreate,
    NoteResponseAll,
    NoteUpdate,
} from "../types/note.ts";
import { http } from "../libs/api-service.ts";
import { routes } from "../constants";
import { Sorting } from "../enums";

export const getAll = async (
    page: number = 1,
    query?: string,
    sorting: Sorting = Sorting.CREATED,
    limit: number = 10,
): Promise<NoteResponseAll> => {
    const params = new URLSearchParams();
    if (query) {
        params.set("search", query);
    }
    params.set("page", page.toString());
    params.set("perPage", limit.toString());
    params.set("sortBy", sorting);

    const { data } = await http.get<NoteResponseAll>(
        `${routes.all}?${params.toString()}`,
    );
    return data;
};

export const getById = async (id: number): Promise<Note> => {
    const { data } = await http.get<Note>(routes.getById(id));
    return data;
};

export const store = async (note: NoteCreate): Promise<Note> => {
    const { data } = await http.post<Note>(routes.create, note);
    return data;
};

export const updateById = async (
    id: number,
    note: NoteUpdate,
): Promise<Note> => {
    const { data } = await http.patch<Note>(routes.update(id), note);
    return data;
};

export const deleteById = async (id: number): Promise<Note> => {
    const { data } = await http.delete<Note>(routes.delete(id));
    return data;
};