import axios from "axios";
const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;
import { BASE_URL } from '../constants';

export const http = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${API_KEY}`
    }
})