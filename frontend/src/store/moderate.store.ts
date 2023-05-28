import { makeAutoObservable } from "mobx";
import { RootStore } from "./store";
import { ModerateService } from "../services/moderate.service";

export class ModerateStore {
  moderateStatus: Record<number, string> = {}; 
  moderateService: ModerateService;
  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);
    this.moderateService = new ModerateService(this);
    this.moderateService.getModerateStatuses();
  }
}
