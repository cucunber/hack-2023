import { apiInstance } from "../../config/api";
import { IOrder } from "../../types/order";
import { PaginatedRequest, PaginatedResponse, RequestData } from "../type";
import { IOrderHistory } from "./type";

export const orderAPI = {
  async getOrder(
    params: PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IOrder>>> {
    try {
      const { data } = await apiInstance.get("/order", {
        params: params,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async postOrder(body: Omit<IOrder, "id">): Promise<RequestData<IOrder>> {
    try {
      const { data } = await apiInstance.post("/order", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getOrderById(id: number): Promise<RequestData<IOrder>> {
    try {
      const { data } = await apiInstance.get(`/order/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async putOrderById(
    id: number,
    body: Omit<IOrder, "id">
  ): Promise<RequestData<IOrder>> {
    try {
      const { data } = await apiInstance.instance.put(`/order/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async patchOrderById(
    id: number,
    body: Omit<IOrder, "id">
  ): Promise<RequestData<IOrder>> {
    try {
      const { data } = await apiInstance.patch(`/order/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async deleteOrderById(id: number): Promise<RequestData<IOrder>> {
    try {
      const { data } = await apiInstance.delete(`/order/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getOrderStatusById(id: number): Promise<RequestData<IOrder>> {
    try {
      const { data } = await apiInstance.get(`/order/${id}/status`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getOrderHistory(
    params: PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IOrderHistory>>> {
    try {
      const { data } = await apiInstance.get("/order-history", {
        params: params,
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async postOrderHistory(
    body: Omit<IOrderHistory, "id">
  ): Promise<RequestData<IOrderHistory>> {
    try {
      const { data } = await apiInstance.post("/order-history", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getOrderHistoryById(id: number): Promise<RequestData<IOrderHistory>> {
    try {
      const { data } = await apiInstance.get(`/order-history/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async putOrderHistoryById(
    id: number,
    body: Omit<IOrderHistory, "id">
  ): Promise<RequestData<IOrderHistory>> {
    try {
      const { data } = await apiInstance.instance.put(`/order-history/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async patchOrderHistoryById(
    id: number,
    body: Omit<IOrderHistory, "id">
  ): Promise<RequestData<IOrderHistory>> {
    try {
      const { data } = await apiInstance.instance.put(`/order-history/${id}`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async deleteOrderHistoryById(
    id: number
  ): Promise<RequestData<IOrderHistory>> {
    try {
      const { data } = await apiInstance.delete(`/order-history/${id}`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
};
