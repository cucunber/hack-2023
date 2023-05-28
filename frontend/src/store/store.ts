import { apiInstance } from "../config/api";
import { Api } from "../utils/api";
import { EventStore } from "./events.store";
import { HallStore } from "./hall.store";
import { PriceStore } from "./price.store";
import { ProfileStore } from "./profile.store";
import { UserStore } from "./user.store";

export class RootStore {
  userStore: UserStore;
  backend: Api;
  profileStore: ProfileStore;
  eventStore: EventStore;
  hallStore: HallStore;
  priceStore: PriceStore;
  constructor() {
    this.backend = apiInstance;
    this.userStore = new UserStore(this);
    this.profileStore = new ProfileStore(this);
    this.eventStore = new EventStore(this);
    this.hallStore = new HallStore(this);
    this.priceStore = new PriceStore(this);
  }
}

export type TRootStore = RootStore;

export const store = new RootStore();
