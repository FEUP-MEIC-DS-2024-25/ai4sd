import { API_BASE_URL } from "./constants";

export async function sendRequest(url: string, method: string, params: { [key: string]: any } = {}) {

    const info: {[key: string]: any} = {
        method: method.toUpperCase()
    };

    if (method.toUpperCase() === "POST") {
        const form = new FormData();

        for (const key in params) {
            form.append(key, params[key]);
        }
    
        info.body = form;
    }

    return fetch(url, info)
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            throw new Error(`Error fetching from the URL: ${error.message}`);
        });
}

export function buildApiUrl(endpoint: string): string {
    const apiUrl = new URL(
        endpoint,
        API_BASE_URL
    );

    return apiUrl.href;
}
