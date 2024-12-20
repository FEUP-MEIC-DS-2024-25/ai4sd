import axios from 'axios';

const BASE_URL = 'https://superhero-07-05-150699885662.europe-west1.run.app/';

export const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${BASE_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-file-type': type
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

export const saveContext = async (context, language) => {
    try {
        const response = await axios.post(`${BASE_URL}/save-context`, { context, language });
        return response.data;
    } catch (error) {
        console.error("Error saving context:", error);
        throw error;
    }
};

export const downloadMutations = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/files/mutations.txt`, {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'mutations.txt');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading mutations file:", error);
        throw error;
    }
};