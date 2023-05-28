import { apiInstance } from "../../config/api";
import { IHall, IHallType, Limits } from "../../types/hall";
import { IOrder } from "../../types/order";
import { PaginatedRequest, PaginatedResponse, RequestData } from "../type";
import { HallRequestFilters } from "./type";

export const hallAPI = {
  async getHall(
    params: HallRequestFilters & PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IHall[]>>> {
    try {
      const { data } = await apiInstance.get("/hall/", {
        params: params,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async postHall(body: FormData): Promise<RequestData<IHall>> {
    try {
      const { data } = await apiInstance.post("/hall/", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getHallType(
    params: PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IHallType[]>>> {
    try {
      const { data } = await apiInstance.get("/hall-type/", {
        params: params,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async postHallType(
    body: Omit<IHallType, "id">
  ): Promise<RequestData<IHallType>> {
    try {
      const { data } = await apiInstance.post("/hall", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getHallTypeById(id: number): Promise<RequestData<IHallType>> {
    try {
      const { data } = await apiInstance.get(`/hall-type/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async putHallTypeById(
    id: number,
    type_name: string
  ): Promise<RequestData<IHallType>> {
    try {
      const { data } = await apiInstance.instance.put(`/hall-type/${id}`, {
        type_name: type_name,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async patchHallTypeById(
    id: number,
    type_name: string
  ): Promise<RequestData<IHallType>> {
    try {
      const { data } = await apiInstance.patch(`/hall-type/${id}`, {
        type_name: type_name,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async deleteHallTypeById(id: number): Promise<RequestData<IHallType>> {
    try {
      const { data } = await apiInstance.delete(`/hall-type/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getHallById(id: number): Promise<RequestData<IHall>> {
    try {
      const { data } = await apiInstance.get(`/hall/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async putHallById(
    id: number,
    body: Omit<IHall, "id">
  ): Promise<RequestData<IHall>> {
    try {
      const { data } = await apiInstance.instance.put(`/hall/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async patchHallById(
    id: number,
    body: FormData,
  ): Promise<RequestData<IHall>> {
    try {
      const { data } = await apiInstance.patch(`/hall/${id}/`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async deleteHallById(id: number): Promise<RequestData<IHall>> {
    try {
      const { data } = await apiInstance.delete(`/hall/${id}/`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getHallAnaliticById(id: number): Promise<RequestData<IHall>> {
    try {
      const { data } = await apiInstance.get(`/hall/${id}/analytic/`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getHallOrderDateById(
    id: number,
    params?: PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IOrder>>> {
    try {
      const { data } = await apiInstance.get(`/hall/${id}/order-date`, {
        params: params,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async deleteHallPropertyById(id: number): Promise<RequestData<IHall>> {
    try {
      const { data } = await apiInstance.delete(`/hall/${id}/property`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getFilteredHall(): Promise<RequestData<Limits>> {
    try {
      const { data } = await apiInstance.get("/hall/filter/");
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
};
