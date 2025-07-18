export interface Note {
    id: number;
    title: string;
    content: string;
    tag: string;
    createdAt: string;
    updatedAt: string;
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