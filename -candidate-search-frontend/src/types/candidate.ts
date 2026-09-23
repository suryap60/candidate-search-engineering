export interface Candidate {
  id: number;
  name: string;
  age: number;
  gender: string;
  education: string;
  location: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface CandidateSearchParams {
  page?: number;
  pageSize?: number;
  minAge?: number | string;
  maxAge?: number | string;
  gender?: string;
  location?: string;
  education?: string;
  createdFrom?: string;
  createdTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | string;
}

export interface PagedResponse<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}