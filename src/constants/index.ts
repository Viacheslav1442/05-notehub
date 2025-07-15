
export const BASE_URL = `https://notehub-public.goit.study/api`

export const routes = {
    all: '/notes',
    create: '/notes',
    getById: (id: number) => `/notes/${id}`,
    update: (id: number) => `/notes/${id}`,
    delete: (id: number) => `/notes/${id}`,
}