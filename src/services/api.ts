// src/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://worknestbackend.onrender.com/api", // or your deployed URL
});

export default API;
