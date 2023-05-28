import { apiInstance } from "../../config/api";
import { IHall } from "../../types/hall";
import { IToken, IUser } from "../../types/user";
import { PaginatedRequest, PaginatedResponse, RequestData } from "../type";

export const userAPI = {
  async createUser(body: Omit<IUser, "id">): Promise<RequestData<IUser>> {
    try {
      const { data } = await apiInstance.post("/user/", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async updateUser(
    id: string | number,
    body: Partial<Omit<IUser, "id">>
  ): Promise<RequestData<IUser>> {
    try {
      const { data } = await apiInstance.post(`/user/${id}/`, body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async createToken(
    body: Pick<IUser, "username"> & { password: string }
  ): Promise<RequestData<IToken>> {
    try {
      const { data } = await apiInstance.post("/token/", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async refreshToken(
    body: Pick<IToken, "refresh">
  ): Promise<RequestData<Pick<IToken, "access">>> {
    try {
      const { data } = await apiInstance.post("/token/refresh/", body);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getUserById(id: string | number): Promise<RequestData<IUser>> {
    try {
      const { data } = await apiInstance.get(`/user/${id}/`);
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getConversationsByUserId({
    id,
    limit,
    offset,
  }: Pick<IUser, "id"> & PaginatedRequest): Promise<
    RequestData<PaginatedResponse<IUser>>
  > {
    try {
      const { data } = await apiInstance.get(`/user/${id}/conversations/`, {
        params: { limit, offset },
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getForRendByUserId({
    id,
    limit,
    offset,
  }: Pick<IUser, "id"> & PaginatedRequest): Promise<RequestData<IHall[]>> {
    try {
      const { data } = await apiInstance.get(`/user/${id}/hall/for-rent/`, {
        params: { limit, offset },
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
  async getRentedByUserId({
    id,
    limit,
    offset,
  }: Pick<IUser, "id"> & PaginatedRequest): Promise<RequestData<IHall[]>> {
    try {
      const { data } = await apiInstance.get(`/user/${id}/hall/rented/`, {
        params: { limit, offset },
      });
      return [false, data];
    } catch (error) {
      return [true, error];
    }
  },
};
