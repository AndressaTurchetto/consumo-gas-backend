import axios from 'axios';
require('dotenv').config();

const API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = 'https://vision.googleapis.com/v1/images:annotate';

export const callGoogleGeminiAPI = async (data: any) => {
  try {
    const response = await axios.post(
      BASE_URL,
      data,
      {
        params: { key: API_KEY },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar a API do Google Gemini:', error);
    throw error;
  }
};

export const analyzeImage = async (imageUrl: string) => {
  try {
    const response = await axios.post(
      BASE_URL,
      {
        requests: [
          {
            image: { source: { imageUri: imageUrl } },
            features: [{ type: 'LABEL_DETECTION' }]
          }
        ]
      },
      {
        params: { key: API_KEY },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar a API do Google:', error);
    throw error;
  }
};
