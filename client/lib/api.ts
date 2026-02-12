import axios from "axios";

const api = axios.create({
  baseURL: "https://careops-api-17m4.onrender.com/api",
});

export default api;