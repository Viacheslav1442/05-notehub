export const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpYWNoZXNsYXYudmVyYnl0c2t5aUBnbWFpbC5jb20iLCJpYXQiOjE3NTIzOTYxNjB9.g0QW5vArIBVspvGeC06F5b_Nk9FSYkaMqAdebgQPX3Y"
export const BASE_URL = `https://notehub-public.goit.study/api/docs`

export const routes = {
    all: '/notes',
    create: '/notes',
    getById: (id: number) => `/notes/${id}`,
    update: (id: number) => `/notes/${id}`,
    delete: (id: number) => `/notes/${id}`,
}