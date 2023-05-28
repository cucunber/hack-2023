import { priceUnitAPI } from "../api/priceUnit";
import { PriceStore } from "../store/price.store";

export class PriceService {
    constructor(private priceStore: PriceStore) {}

    async getPrices(){
        const [error, data] = await priceUnitAPI.getPriceUnit({});
        if(!error){
            this.priceStore.prices = data.results;
        }
    }
}