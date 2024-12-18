import { API_MODELS_ENDPOINT } from "./utils/constants";
import { buildApiUrl, sendRequest } from "./utils/request";
export async function getModels() {
    try {
        const apiUrl = buildApiUrl(API_MODELS_ENDPOINT);
        const response = await sendRequest(apiUrl, "GET");
        const models = response["data"];
        return models.reduce((options, model) => options += `<option value="groq/${model}">${model}</option>`, "");
    }
    catch (e) {
        throw new Error(`Error fetching from the URL: ${e}`);
    }
}
