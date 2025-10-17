import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3056';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SendVerificationRequest {
  type: 'EMAIL' | 'SMS';
  recipient: string;
}

export interface SendVerificationResponse {
  message: string;
}

export interface VerifyCodeRequest {
  type: 'EMAIL' | 'SMS';
  recipient: string;
  code: string;
}

export interface VerifyCodeResponse {
  message: string;
  verificationToken: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  phoneNumber: string;
  emailVerificationToken: string;
  phoneVerificationToken: string;
  termsAgreement: boolean;
  marketingAgreement: boolean;
}

export interface SignUpResponse {
  message: string;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export const authService = {
  sendVerification: async (data: SendVerificationRequest): Promise<SendVerificationResponse> => {
    const response = await api.post<SendVerificationResponse>('/auth/send-verification', data);
    return response.data;
  },

  verifyCode: async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
    const response = await api.post<VerifyCodeResponse>('/auth/verify-code', data);
    return response.data;
  },

  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await api.post<SignUpResponse>('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
};
