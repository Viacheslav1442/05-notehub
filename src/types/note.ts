export interface Note {
    id: number;
    title: string;
    content: string;
    tag: string;
    createdAt: Date
    updatedAt: Date
}
export type NoteUpdate = {
    title?: string;
    content?: string;
    tag?: string;
}

export type NoteCreate = {
    title: string;
    content: string;
    tag: string;
}

export interface NoteResponseAll {
    notes: Note[];
    totalPages: number;
}