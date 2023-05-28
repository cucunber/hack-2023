import { apiInstance } from "../../config/api";
import { IConversation } from "../../types/conversation";
import { PaginatedRequest, PaginatedResponse, RequestData } from "../type";

export const conversationAPI = {
  async getConversation(
    params: PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IConversation>>> {
    try {
      const { data } = await apiInstance.get("/conversation", {
        params: params,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async postConversation(
    body: Omit<IConversation, "id">
  ): Promise<RequestData<IConversation>> {
    try {
      const { data } = await apiInstance.post("/conversation", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getConversationById(id: number): Promise<RequestData<IConversation>> {
    try {
      const { data } = await apiInstance.get(`/conversation/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async putConversationById(
    id: number,
    body: Omit<IConversation, "id">
  ): Promise<RequestData<IConversation>> {
    try {
      const { data } = await apiInstance.instance.put(`/conversation/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async patchConversationById(
    id: number,
    body: Omit<IConversation, "id">
  ): Promise<RequestData<IConversation>> {
    try {
      const { data } = await apiInstance.patch(`/conversation/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async deleteConversationById(
    id: number
  ): Promise<RequestData<IConversation>> {
    try {
      const { data } = await apiInstance.delete(`/conversation/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
};
