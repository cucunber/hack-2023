import { makeAutoObservable } from "mobx";
import { HallService } from "../services/hall.service";
import { IHallType } from "../types/hall";
import { RootStore } from "./store";

export class HallStore {
  hallTypes: IHallType[] = [];
  hallService: HallService;
  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);
    this.hallService = new HallService(this);
    this.hallService.getHallTypes();
  }

  getHallTypeById(id: number) {
    return this.hallTypes.reduce((acc, value) => {
      acc[value.id] = value.type_name;
      return acc;
    }, {} as Record<number, string>)[id];
  }
}
