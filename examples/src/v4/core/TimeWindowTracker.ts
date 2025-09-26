import dayjs from 'dayjs';
import { AdEngine } from './AdEngine';

export class TimeWindowTracker {
  #markedTimeWindow: Map<Amity.AdPlacement, string>;
  static #instance: TimeWindowTracker;

  constructor() {
    this.#markedTimeWindow = new Map();
  }

  public static get instance(): TimeWindowTracker {
    if (!TimeWindowTracker.#instance) {
      TimeWindowTracker.#instance = new TimeWindowTracker();
    }
    return TimeWindowTracker.#instance;
  }

  hasReachedLimit(placement: Amity.AdPlacement): boolean {
    const currentWindowKey = this.#getCurrentWindowKey(placement);
    return this.#markedTimeWindow.get(placement) === currentWindowKey;
  }

  markSeen(placement: Amity.AdPlacement) {
    this.#markedTimeWindow.set(placement, this.#getCurrentWindowKey(placement));
  }

  #getTimeWindowSettings(placement: Amity.AdPlacement): number {
    const adFrequency = AdEngine.instance.getAdFrequencyByPlacement(placement);

    if (adFrequency == null || adFrequency.type !== 'time-window') {
      return 0;
    }
    return adFrequency.value;
  }

  #getCurrentWindowKey(placement: Amity.AdPlacement) {
    const today = dayjs();
    const minuteSinceStartOfADay = today.startOf('day').diff(today, 'minute');
    const windowIndex = Math.ceil(minuteSinceStartOfADay / this.#getTimeWindowSettings(placement));
    return `${today.format('DD-MM-YYYY')}-${windowIndex}`;
  }
}
