import { apiInstance } from "../../config/api";
import { IPriceUnit } from "../../types/priceUnit";
import { PaginatedRequest, PaginatedResponse, RequestData } from "../type";

export const priceUnitAPI = {
  async getPriceUnit(
    params: PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IPriceUnit[]>>> {
    try {
      const { data } = await apiInstance.get("/price-unit/", {
        params: params,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async postPriceUnit(
    body: Omit<IPriceUnit, "id">
  ): Promise<RequestData<IPriceUnit>> {
    try {
      const { data } = await apiInstance.post("/price-unit/", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getPriceUnitById(id: number): Promise<RequestData<IPriceUnit>> {
    try {
      const { data } = await apiInstance.get(`/price-unit/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async putPriceUnitById(
    id: number,
    body: Omit<IPriceUnit, "id">
  ): Promise<RequestData<IPriceUnit>> {
    try {
      const { data } = await apiInstance.instance.put(`/price-unit/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async patchPriceUnitById(
    id: number,
    body: Omit<IPriceUnit, "id">
  ): Promise<RequestData<IPriceUnit>> {
    try {
      const { data } = await apiInstance.patch(`/price-unit/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async deletePriceUnitById(id: number): Promise<RequestData<IPriceUnit>> {
    try {
      const { data } = await apiInstance.delete(`/price-unit/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
};
