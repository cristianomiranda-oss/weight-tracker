import { minutesToMilliseconds } from "./time";
import type { CachedObj, WeightEntryType } from "./types";

const weightEntryArrKey = "weight_entry_cache";

export function cacheWeightEntryArray(weightEntryArray: WeightEntryType[]) {
  const storageTime = Date.now();

  // Initializes the cached object
  const cachedObj: CachedObj = {
    storageTime,
    weightEntryArray: weightEntryArray,
  };

  // Stores the object
  sessionStorage.setItem(weightEntryArrKey, JSON.stringify(cachedObj));
}

export function getCachedWeightEntryArray() {
    const cachedObjStr = sessionStorage.getItem(weightEntryArrKey);

    if (cachedObjStr === null) {
        return null;
    }

    const cachedObj: CachedObj = JSON.parse(cachedObjStr);

    // Calculates the expiration time for the cache and gets the current time in milliseconds
    const expirationTime = cachedObj.storageTime + minutesToMilliseconds(5);
    const currentTime = Date.now();

    if (expirationTime === currentTime) {
        // Returns null to denote that the cache is no longer valid
        return null;
    }

    // Returns the cached weight entry array
    return cachedObj.weightEntryArray;
}

