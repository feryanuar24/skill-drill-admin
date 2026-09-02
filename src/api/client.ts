/// <reference types="vite/client" />
import axios, { AxiosInstance, AxiosError } from "axios";
import { logout } from "../stores/auth";
import { replace } from "../stores/routerCompat";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
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

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
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

  async logout(): Promise<void> {
    await this.client.post("/auth/logout");
    this.clearToken();
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    const response = await this.client.get<ApiResponse<User[]>>("/users");
    return response.data.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await this.client.post<ApiResponse<User>>("/users", data);
    return response.data.data;
  }

  async updateUser(
    id: number,
    data: Partial<CreateUserRequest>,
  ): Promise<User> {
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
  async getTopics(): Promise<Topic[]> {
    const response = await this.client.get<ApiResponse<Topic[]>>("/topics");
    return response.data.data;
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
  async getQuestions(topicId?: number, search?: string): Promise<Question[]> {
    const params: Record<string, string> = {};
    if (topicId) {
      params.topic_id = topicId.toString();
    }
    if (search && search.trim()) {
      params.search = search.trim();
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

    const response = await this.client.post(
      "/admin/generate-questions",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.data;
  }
}

export default new ApiClient();
