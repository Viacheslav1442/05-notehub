export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    tag: NoteTag;
}

export interface NoteCreate {
    title: string;
    content: string;
    tag: NoteTag;
}

export interface NoteUpdate {
    title?: string;
    content?: string;
    tag?: NoteTag;
}
