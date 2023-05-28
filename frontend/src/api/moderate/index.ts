import { apiInstance } from "../../config/api";
import { IModerateStatus } from "../../types/moderate";
import { PaginatedResponse, RequestData } from "../type";

export const moderateAPI = {
  async getModerateStatuses(): Promise<
    RequestData<PaginatedResponse<IModerateStatus[]>>
  > {
    try {
      const { data } = await apiInstance.get("/moderating-status/");
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
};
