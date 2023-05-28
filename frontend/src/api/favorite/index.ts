import { apiInstance } from "../../config/api";
import { IFavorite } from "../../types/favorite";
import { PaginatedRequest, PaginatedResponse, RequestData } from "../type";

export const favoriteAPI = {
  async getFavorite(
    params: PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IFavorite>>> {
    try {
      const { data } = await apiInstance.get("/favorite", {
        params: params,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async postFavorite(
    body: Omit<IFavorite, "id">
  ): Promise<RequestData<IFavorite>> {
    try {
      const { data } = await apiInstance.post("/favorite", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getFavoriteById(id: number): Promise<RequestData<IFavorite>> {
    try {
      const { data } = await apiInstance.get(`/favorite/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async putFavoriteById(
    id: number,
    body: Omit<IFavorite, "id">
  ): Promise<RequestData<IFavorite>> {
    try {
      const { data } = await apiInstance.instance.put(`/favorite/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async patchFavoriteById(
    id: number,
    body: Omit<IFavorite, "id">
  ): Promise<RequestData<IFavorite>> {
    try {
      const { data } = await apiInstance.patch(`/favorite/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async deleteFavoriteById(id: number): Promise<RequestData<IFavorite>> {
    try {
      const { data } = await apiInstance.delete(`/favorite/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
};
