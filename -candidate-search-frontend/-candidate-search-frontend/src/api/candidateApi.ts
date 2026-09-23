import api from "./axios";
import type {
  ApiResponse,
  Candidate,
  CandidateSearchParams,
  PagedResponse,
} from "../types/candidate";

export const searchCandidates = async (
  params: CandidateSearchParams
): Promise<ApiResponse<PagedResponse<Candidate>>> => {
  const cleanParams: Record<string, string | number> = {};

  if (params.page !== undefined && params.page !== null && Number(params.page) > 0) {
    cleanParams.page = Number(params.page);
  }
  if (params.pageSize !== undefined && params.pageSize !== null && Number(params.pageSize) > 0) {
    cleanParams.pageSize = Number(params.pageSize);
  }
  if (params.minAge !== undefined && params.minAge !== null && params.minAge !== "") {
    cleanParams.minAge = Number(params.minAge);
  }
  if (params.maxAge !== undefined && params.maxAge !== null && params.maxAge !== "") {
    cleanParams.maxAge = Number(params.maxAge);
  }
  if (params.gender && params.gender.trim() && params.gender !== "All") {
    cleanParams.gender = params.gender.trim();
  }
  if (params.location && params.location.trim()) {
    cleanParams.location = params.location.trim();
  }
  if (params.education && params.education.trim()) {
    cleanParams.education = params.education.trim();
  }
  if (params.createdFrom && params.createdFrom.trim()) {
    cleanParams.createdFrom = params.createdFrom.trim();
  }
  if (params.createdTo && params.createdTo.trim()) {
    cleanParams.createdTo = params.createdTo.trim();
  }
  if (params.lastLoginFrom && params.lastLoginFrom.trim()) {
    cleanParams.lastLoginFrom = params.lastLoginFrom.trim();
  }
  if (params.lastLoginTo && params.lastLoginTo.trim()) {
    cleanParams.lastLoginTo = params.lastLoginTo.trim();
  }
  if (params.sortBy && params.sortBy.trim()) {
    cleanParams.sortBy = params.sortBy.trim();
  }
  if (params.sortOrder && params.sortOrder.trim()) {
    cleanParams.sortOrder = params.sortOrder.trim();
  }

  const response = await api.get<ApiResponse<PagedResponse<Candidate>>>(
    "/candidates/search",
    {
      params: cleanParams,
    }
  );

  return response.data;
};