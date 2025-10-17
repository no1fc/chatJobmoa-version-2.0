import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3056';

export interface JobPosting {
  id: string;
  title: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // INP-001: 핵심 채용 정보
  companyName?: string | null;
  jobType?: string | null;
  position?: string | null;
  careerLevel?: string | null;
  employmentType?: string | null;
  salaryRange?: string | null;
  workLocation?: string | null;
  // INP-003: 기업 정보
  companyIntro?: string | null;
  companyCulture?: string | null;
  benefits?: string | null;
  logoImageUrl?: string | null;
  // INP-004: 스타일 설정
  colorTone?: string | null;
  styleConcept?: string | null;
  // INP-005: 선택된 혜택
  selectedBenefitsJson?: string | null;
  // GEN-001/002: 생성된 결과물
  generatedPosterUrl?: string | null;
  generatedBannerUrl?: string | null;
  generatedHtml?: string | null;
}

export type JobPostingDetail = JobPosting;

export interface PostingListItem {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
}

export interface PostingListResponse {
  data: PostingListItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface CreatePostingRequest {
  title: string;
}

export interface UpdatePostingRequest {
  title?: string;
  status?: string;
  companyName?: string;
  jobType?: string;
  position?: string;
  careerLevel?: string;
  employmentType?: string;
  salaryRange?: string;
  workLocation?: string;
  companyIntro?: string;
  companyCulture?: string;
  benefits?: string;
  logoImageUrl?: string;
  colorTone?: string;
  styleConcept?: string;
  selectedBenefitsJson?: string;
  generatedPosterUrl?: string;
  generatedBannerUrl?: string;
  generatedHtml?: string;
}

export interface GetPostingsQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const postingService = {
  create: async (
    data: CreatePostingRequest,
    token: string,
  ): Promise<JobPosting> => {
    const response = await axios.post(`${API_URL}/postings`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getAll: async (
    query: GetPostingsQuery,
    token: string,
  ): Promise<PostingListResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.order) params.append('order', query.order);

    const response = await axios.get(`${API_URL}/postings?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getOne: async (id: string, token: string): Promise<JobPosting> => {
    const response = await axios.get(`${API_URL}/postings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  update: async (
    id: string,
    data: UpdatePostingRequest,
    token: string,
  ): Promise<JobPosting> => {
    const response = await axios.patch(`${API_URL}/postings/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  delete: async (id: string, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/postings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
