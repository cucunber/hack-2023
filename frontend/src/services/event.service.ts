import { eventAPI } from "../api/event";
import { EventStore } from "../store/events.store";

export class EventService {
  constructor(private eventStore: EventStore) {}

  async getEvents(...args: Parameters<typeof eventAPI.getEvents>) {
    const [params] = args;
    const [error, data] = await eventAPI.getEvents(params);
    if (!error) {
      this.eventStore.events = data.results;
    }
  }
}
