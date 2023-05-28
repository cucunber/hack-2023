import { makeAutoObservable } from "mobx";
import { PriceService } from "../services/price.service";
import { IPriceUnit } from "../types/priceUnit";
import { RootStore } from "./store";

export class PriceStore {
  prices: IPriceUnit[] = [];
  priceService: PriceService;
  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);
    this.priceService = new PriceService(this);
    this.priceService.getPrices();
  }

  private priceIdMap = this.prices.reduce((acc, value) => {
    acc[value.id] = value.unit_name;
    return acc;
  }, {} as Record<number, string>);

  priceById(id: number) {
    return this.priceIdMap[id];
  }
}
