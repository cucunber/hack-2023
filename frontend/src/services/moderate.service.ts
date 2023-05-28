import { moderateAPI } from "../api/moderate";
import { ModerateStore } from "../store/moderate.store";

export class ModerateService {
  constructor(private moderateStore: ModerateStore) {}

  async getModerateStatuses() {
    const [error, data] = await moderateAPI.getModerateStatuses();
    if (!error) {
      this.moderateStore.moderateStatus = data.results.reduce(
        (acc, { id, moderating_status_name }) => {
          acc[id] = moderating_status_name;
          return acc;
        },
        {} as Record<number, string>
      );
    }
  }
}
