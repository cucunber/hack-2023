import { makeAutoObservable } from "mobx";
import { IEvent } from "../types/event";
import { RootStore } from "./store";
import { EventService } from "../services/event.service";

export class EventStore {
  events: IEvent[] = [];
    eventsService: EventService;
  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);
    this.eventsService = new EventService(this);
  }
}
