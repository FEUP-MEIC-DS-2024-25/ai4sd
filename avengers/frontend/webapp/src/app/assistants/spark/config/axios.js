import axios from "axios";
import { getCsrfToken } from "../utils/csrf";

const apiClient = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

apiClient.defaults.headers.common["X-CSRFToken"] = getCsrfToken();

apiClient.interceptors.request.use(
    (config) => {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            config.headers["X-CSRFToken"] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/login/";
        }
        return Promise.reject(error);
    }


)
export default apiClient;