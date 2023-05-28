import { userAPI } from "../api/user";
import { ProfileStore } from "../store/profile.store";
import { IUser } from "../types/user";

export class ProfileService {
  constructor(private profileStore: ProfileStore) {}

  async getProfileById(id: string | number) {
    const [error, data] = await userAPI.getUserById(id);
    if (!error) {
      this.profileStore.info = data;
    }
    return error;
  }
  async getHallsForRendByUserId(
    ...args: Parameters<typeof userAPI.getForRendByUserId>
  ) {
    const [params] = args;
    const [error, data] = await userAPI.getForRendByUserId(params);
    if (!error) {
      this.profileStore.forRent = data;
    }
    return error;
  }
  async getRentedHallsByUserId(
    ...args: Parameters<typeof userAPI.getRentedByUserId>
  ) {
    const [params] = args;
    const [error, data] = await userAPI.getForRendByUserId(params);
    if (!error) {
      this.profileStore.rented = data;
    }
    return error;
  }
  async updateProfile(id: string | number, params: Omit<IUser, "id">) {
    const [error, data] = await userAPI.updateUser(id, params);
    if (!error) {
      this.profileStore.rootStore.userStore.user = data;
    }
    return error;
  }
}
