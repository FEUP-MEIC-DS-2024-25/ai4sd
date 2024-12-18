const API_BASE_URL = "https://superhero-06-04-150699885662.europe-west1.run.app";

export const generateContent = async (prompt, assistantId) => {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, assistantId }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate content.");
  }

  return response.json();
};

export const uploadLogFile = async (file) => {
  const formData = new FormData();
  formData.append("logfile", file);

  const response = await fetch(`${API_BASE_URL}/upload-log`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload log file.");
  }

  return response.json();
};
