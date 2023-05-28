import { hallAPI } from "../api/hall";
import { propertyAPI } from "../api/property";
import { HallStore } from "../store/hall.store";

export class HallService {
  constructor(public hallStore: HallStore) {}
  async getHallTypes() {
    const [error, data] = await hallAPI.getHallType({});
    if (!error) {
      this.hallStore.hallTypes = data.results;
    }
  }
  static async getHallPropertiesById(id: string) {
    const [error, data] = await propertyAPI.getPropertyById(+id);
    if (error) {
      return [];
    }
    return data;
  }
  static async createHall(formData: FormData) {
    const data = await hallAPI.postHall(formData);
    return data;
  }
}
