import { apiInstance } from "../../config/api";
import { IEvent } from "../../types/event";
import { PaginatedRequest, PaginatedResponse, RequestData } from "../type";

export const eventAPI = {
  async getEvents(
    params: PaginatedRequest
  ): Promise<RequestData<PaginatedResponse<IEvent[]>>> {
    try {
      const { data } = await apiInstance.get("/event/", { params });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async createEvent(body: {
    event_type_name: string;
  }): Promise<RequestData<IEvent>> {
    try {
      const { data } = await apiInstance.post("/event/", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getEventById(id: string | number): Promise<RequestData<IEvent>> {
    try {
      const { data } = await apiInstance.post(`/event/${id}/`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
};
