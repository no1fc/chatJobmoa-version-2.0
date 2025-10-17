import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3056';

export interface RecommendKeywordsRequest {
  jobType: string;
  position: string;
}

export interface RecommendKeywordsResponse {
  keywords: string[];
  qualifications: string[];
}

export interface SmeBenefit {
  id: string;
  name: string;
  description: string;
  sourceUrl?: string;
  isActive: boolean;
  lastChecked: string;
}

export const aiGeneratorService = {
  recommendKeywords: async (
    data: RecommendKeywordsRequest,
    token: string,
  ): Promise<RecommendKeywordsResponse> => {
    const response = await axios.post(`${API_URL}/ai/recommend/keywords`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  generateImages: async (postingId: string, token: string) => {
    const response = await axios.post(
      `${API_URL}/generate/${postingId}/images`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  generateHtml: async (postingId: string, token: string) => {
    const response = await axios.post(
      `${API_URL}/generate/${postingId}/html`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  getActiveBenefits: async (): Promise<SmeBenefit[]> => {
    const response = await axios.get(`${API_URL}/benefits`);
    return response.data;
  },

  uploadLogo: async (
    postingId: string,
    file: File,
    token: string,
  ) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_URL}/postings/${postingId}/logo-upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },
};
