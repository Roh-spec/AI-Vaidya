import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 120_000,
});

export function apiErrorMessage(error) {
  if (error.response) {
    const detail = error.response.data?.detail;
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (error.response.status === 500) return 'The consultation service hit a server error. Please try again.';
    return `Consultation request failed with status ${error.response.status}.`;
  }

  if (error.request) {
    return 'Cannot reach the consultation API. Start the backend with `uvicorn main:app --reload --host 0.0.0.0 --port 8000`, then try again.';
  }

  return error.message || 'An unexpected consultation error occurred.';
}

export async function uploadPdf(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post('/upload', formData);
  return response.data;
}

export async function askQuestion(question) {
  const response = await client.post('/ask', { question });
  return response.data;
}
