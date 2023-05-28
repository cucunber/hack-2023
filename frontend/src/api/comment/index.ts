import { apiInstance } from "../../config/api";
import { IComment } from "../../types/comment";
import { PaginatedRequest, PaginatedResponse, RequestData } from "../type";

export const commentAPI = {
  async getComment(
    params: PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IComment>>> {
    try {
      const { data } = await apiInstance.get("/comment", {
        params: params,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async postComment(
    body: Omit<IComment, "id">
  ): Promise<RequestData<IComment>> {
    try {
      const { data } = await apiInstance.post("/comment", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getCommentById(id: number): Promise<RequestData<IComment>> {
    try {
      const { data } = await apiInstance.get(`/comment/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async putCommentById(
    id: number,
    body: Omit<IComment, "id">
  ): Promise<RequestData<IComment>> {
    try {
      const { data } = await apiInstance.instance.put(`/comment/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async patchCommentById(
    id: number,
    body: Omit<IComment, "id">
  ): Promise<RequestData<IComment>> {
    try {
      const { data } = await apiInstance.patch(`/comment/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async deleteCommentById(id: number): Promise<RequestData<IComment>> {
    try {
      const { data } = await apiInstance.delete(`/comment/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
};
