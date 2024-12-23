import axios from "axios";
import { API_BASE_URL } from "@env";

const api = axios.create({
  baseURL: process.env.REACT_API_BASE_URL,
});

export default api;
