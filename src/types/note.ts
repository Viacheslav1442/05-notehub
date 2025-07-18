export interface Note {
    id: number;
    title: string;
    content?: string;
    tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
    createdAt: string;
    updatedAt: string;
}

export interface NoteCreate {
    title: string;
    content?: string;
    tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

export interface NoteUpdate {
    title?: string;
    content?: string;
    tag?: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}