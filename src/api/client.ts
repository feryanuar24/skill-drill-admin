/// <reference types="vite/client" />
import axios, { AxiosInstance, AxiosError } from "axios";
import { logout } from "../stores/auth";
import { replace } from "../stores/routerCompat";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface PaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  is_verified?: boolean;
  sort_by?: string;
  order?: "asc" | "desc";
  all?: boolean;
}

export interface TopicQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  all?: boolean;
}

export interface QuestionQueryParams {
  page?: number;
  limit?: number;
  topic_id?: number;
  search?: string;
  correct_answer?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  all?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export interface RegisterResponse {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    is_verified?: boolean;
    created_at?: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password?: string;
  role: string;
  is_verified?: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  is_verified?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  current_streak: number;
  highest_streak: number;
  is_verified: boolean;
  created_at: string;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface CreateTopicRequest {
  name: string;
  description: string;
}

export interface GenerateQuestionsRequest {
  topic_id: number;
  num_questions: number;
  prompt_theme: string;
  difficulty?: string;
}

export interface Question {
  id: number;
  topic_id: number;
  topic?: Topic;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  created_at: string;
}

export interface CreateQuestionRequest {
  topic_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string;
}

export interface UpdateQuestionRequest {
  topic_id?: number;
  question_text?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer?: string;
  explanation?: string;
}

export interface GenerateQuestionsResponse {
  questions: Question[];
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.loadToken();

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          logout();
          replace("/login");
        }
        return Promise.reject(error);
      },
    );
  }

  private loadToken() {
    this.token = localStorage.getItem("token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      {
        email,
        password,
      },
    );
    return response.data.data;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.client.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      data,
    );
    return response.data.data;
  }

  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    const response = await this.client.get<ApiResponse<null>>("/auth/verify", {
      params: { token },
    });
    return response.data;
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const response = await this.client.post<ApiResponse<null>>(
      "/auth/forgot-password",
      { email },
    );
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<null>> {
    const response = await this.client.post<ApiResponse<null>>(
      "/auth/reset-password",
      data,
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post("/auth/logout");
    this.clearToken();
  }

  // User endpoints
  async getUsers(params?: UserQueryParams): Promise<User[]> {
    const finalParams = params !== undefined ? params : { all: true };
    const res = await this.getUsersPaginated(finalParams);
    return res.users;
  }

  async getUsersPaginated(params?: UserQueryParams): Promise<{
    users: User[];
    pagination?: PaginationMeta;
  }> {
    const response = await this.client.get<ApiResponse<User[]>>("/users", {
      params,
    });
    return {
      users: response.data.data || [],
      pagination: response.data.pagination,
    };
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await this.client.post<ApiResponse<User>>("/users", data);
    return response.data.data;
  }

  async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>(
      `/users/${id}`,
      data,
    );
    return response.data.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }

  // Topic endpoints
  async getTopics(params?: TopicQueryParams): Promise<Topic[]> {
    const finalParams = params !== undefined ? params : { all: true };
    const res = await this.getTopicsPaginated(finalParams);
    return res.topics;
  }

  async getTopicsPaginated(params?: TopicQueryParams): Promise<{
    topics: Topic[];
    pagination?: PaginationMeta;
  }> {
    const response = await this.client.get<ApiResponse<Topic[]>>("/topics", {
      params,
    });
    return {
      topics: response.data.data || [],
      pagination: response.data.pagination,
    };
  }

  async getTopicById(id: number): Promise<Topic> {
    const response = await this.client.get<ApiResponse<Topic>>(`/topics/${id}`);
    return response.data.data;
  }

  async createTopic(data: CreateTopicRequest): Promise<Topic> {
    const response = await this.client.post<ApiResponse<Topic>>(
      "/topics",
      data,
    );
    return response.data.data;
  }

  async updateTopic(
    id: number,
    data: Partial<CreateTopicRequest>,
  ): Promise<Topic> {
    const response = await this.client.put<ApiResponse<Topic>>(
      `/topics/${id}`,
      data,
    );
    return response.data.data;
  }

  async deleteTopic(id: number): Promise<void> {
    await this.client.delete(`/topics/${id}`);
  }

  // Question endpoints
  async getQuestions(
    topicIdOrParams?: number | QuestionQueryParams,
    search?: string,
  ): Promise<Question[]> {
    let params: Record<string, any> = {};
    if (typeof topicIdOrParams === "number") {
      params.all = true;
      if (topicIdOrParams > 0) {
        params.topic_id = topicIdOrParams;
      }
      if (search && search.trim()) {
        params.search = search.trim();
      }
    } else if (
      typeof topicIdOrParams === "object" &&
      topicIdOrParams !== null
    ) {
      params = { ...topicIdOrParams };
    } else {
      params = { all: true };
      if (search && search.trim()) {
        params.search = search.trim();
      }
    }
    const response = await this.client.get<ApiResponse<Question[]>>(
      "/questions",
      { params },
    );
    return response.data.data;
  }

  async getQuestionById(id: number): Promise<Question> {
    const response = await this.client.get<ApiResponse<Question>>(
      `/questions/${id}`,
    );
    return response.data.data;
  }

  async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    const response = await this.client.post<ApiResponse<Question>>(
      "/questions",
      data,
    );
    return response.data.data;
  }

  async updateQuestion(
    id: number,
    data: UpdateQuestionRequest,
  ): Promise<Question> {
    const response = await this.client.put<ApiResponse<Question>>(
      `/questions/${id}`,
      data,
    );
    return response.data.data;
  }

  async deleteQuestion(id: number): Promise<void> {
    await this.client.delete(`/questions/${id}`);
  }

  async generateQuestions(
    topicId: number,
    numQuestions: number,
    promptTheme: string,
    file?: File,
  ): Promise<GenerateQuestionsResponse> {
    const formData = new FormData();
    formData.append("topic_id", topicId.toString());
    formData.append("num_questions", numQuestions.toString());
    formData.append("prompt_theme", promptTheme);
    if (file) {
      formData.append("file_pdf", file);
    }

    const response = await this.client.post("/questions/generate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  }
}

export default new ApiClient();
