import axios from "axios";

const axiosServices = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

export default axiosServices;
