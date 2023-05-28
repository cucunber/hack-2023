import { makeAutoObservable } from "mobx";
import { RootStore } from "./store";
import { IHall } from "../types/hall";
import { ProfileService } from "../services/profile.service";
import { IUser } from "../types/user";

export class ProfileStore {
  info: IUser | null = null;
  forRent: IHall[] = [];
  rented: IHall[] = [];
  favorite: IHall[] = [];
  profileService: ProfileService;
  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);
    this.profileService = new ProfileService(this);
  }
  async initialProfile(id: number) {
    const requests = [
      this.profileService.getProfileById(id),
      this.profileService.getHallsForRendByUserId({ id }),
      this.profileService.getRentedHallsByUserId({ id }),
    ];
    const [info, forRent, rented] = await Promise.allSettled(requests);
    const successInfo = info.status === "fulfilled" && !info.value;
    const successForRend = forRent.status === "fulfilled" && !forRent.value;
    const successRented = rented.status === "fulfilled" && !rented.value;
    return {
      successInfo,
      successForRend,
      successRented,
    };
  }
}
