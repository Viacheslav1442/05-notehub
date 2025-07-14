import axios from "axios";
import { API_KEY, BASE_URL } from "../constants";

export const http = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${API_KEY}`
    }
})