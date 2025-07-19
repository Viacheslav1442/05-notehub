export interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    tags: NoteTag;
}


export interface NoteCreate {
    title: string;
    content: string;
    tags: string[];
}

export interface NoteUpdate {
    title?: string;
    content?: string;
    tags?: string[];
}

export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';