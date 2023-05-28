import { apiInstance } from "../../config/api";
import { IProperty } from "../../types/property";
import { PaginatedRequest, PaginatedResponse, RequestData } from "../type";

export const propertyAPI = {
  async getProperty(
    params: PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IProperty>>> {
    try {
      const { data } = await apiInstance.get("/property", {
        params: params,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async postProperty(
    body: Omit<IProperty, "id">
  ): Promise<RequestData<IProperty>> {
    try {
      const { data } = await apiInstance.post("/property", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getPropertyById(id: number): Promise<RequestData<IProperty>> {
    try {
      const { data } = await apiInstance.get(`/property/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async putPropertyById(
    id: number,
    body: Omit<IProperty, "id">
  ): Promise<RequestData<IProperty>> {
    try {
      const { data } = await apiInstance.instance.put(`/property/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async patchPropertyById(
    id: number,
    body: Omit<IProperty, "id">
  ): Promise<RequestData<IProperty>> {
    try {
      const { data } = await apiInstance.patch(`/property/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async deletePropertyById(id: number): Promise<RequestData<IProperty>> {
    try {
      const { data } = await apiInstance.delete(`/property/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
};
