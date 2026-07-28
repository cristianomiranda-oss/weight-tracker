import { minutesToMilliseconds } from "./time";
import type { CachedObj, WeightEntryType } from "./types";

const weightEntryArrKey = "weight_entry_cache";

function storeCachedObject(cachedObj: CachedObj) {
  try {
    // Stores the object
    sessionStorage.setItem(weightEntryArrKey, JSON.stringify(cachedObj));
  } catch (error) {
    // Catches and logs any error and returns null
    console.error("Session Storage Setting\n", error);
    return;
  }
}

function getCachedObject() {
  try {
    const cachedObjStr = sessionStorage.getItem(weightEntryArrKey);
  
    if (cachedObjStr === null) {
      return null
    }
  
    // Parses the string into an object
    const cachedObj: CachedObj = JSON.parse(cachedObjStr);
  
    // Gets the current time and expiration time in milliseconds
    const currentTime = Date.now();
    const expirationTime = cachedObj.expirationTime;
  
    // Checks if the current time is past the expiration time
    if (currentTime >= expirationTime) {
        // Returns null to denote that the cache is no longer valid
        return null;
    }
  
    return cachedObj
  } catch (error) {
    // Catches and logs any error and returns null
    console.error("Session Storage Getting\n", error);
    return null;
  }
}

/**
   * Stores the passed in weight entry and assigns it an expiration time before storing in session storage
   * @param {WeightEntryType[]} weightEntryArray The weight entry array to be stored.
   */
export function cacheWeightEntryArray(weightEntryArray: WeightEntryType[]) {
  try {
    // Calculates the expiration time, one minute after the time of storing
    const expirationTime = Date.now() + minutesToMilliseconds(1);
  
    // Initializes the cached object
    const cachedObj: CachedObj = {
      expirationTime,
      weightEntryArray: weightEntryArray,
    };
  
    // Stores the object
    storeCachedObject(cachedObj);
  } catch (error) {
    // Catches and logs any error
    console.error("Session Storage Storing\n", error);
  }
}

/**
   * Gets the cached weight entry array from storage but checks if the cached array is expired before returning. 
   * @returns Returns null if the session storage is empty or the cached array has expired.
   */
export function getCachedWeightEntryArray(): WeightEntryType[] | null {
  try {
    const cachedObj = getCachedObject();

    if (cachedObj === null) {
        return null;
    }

    // Returns the cached weight entry array
    return cachedObj.weightEntryArray;
  } catch (error) {
    // Catches and logs any error and returns null
    console.error("Session Storage Retrieval\n", error);
    return null;
  }
}

export function updateCachedWeightEntryArray(entryId: string, newWeightValue: number, newWeighInDate: Date) {
  try {
    const cachedObj = getCachedObject();

    // Checks if the cache is valid and should be updated
    if (cachedObj === null) {
        // Exits the function is the cache does not exist or is expired
        return;
    }

    const updatedArray = cachedObj.weightEntryArray;

    // Iterates through the array until the entry is found
    for (let i = 0; i < updatedArray.length; i++) {
      if (updatedArray[i].weightEntryId === entryId) {
        // Updates the entry in the array
        updatedArray[i].weightValue = newWeightValue;
        updatedArray[i].weighInDate = newWeighInDate;

        // Initializes a new cache object with the updated array and existing expiration time
        const updatedCacheObj: CachedObj = {expirationTime: cachedObj.expirationTime, weightEntryArray: updatedArray}
        // Stores the updated array with the existing expiration time
        storeCachedObject(updatedCacheObj);

        // Exits the function;
        return;
      }
    }

    // Throws an error indicating the entry id was invalid
    throw new Error("Invalid Entry Id")
  } catch (error) {
    // Catches and logs any error
    console.error("Session Storage Updating\n", error);
  }
}

/**
   * Removes an entry from the cached array. If the cached array is expired, the process is forgone.
   * The cached array is updated but the expiration time remains the same.
   *
   * @param entryId The entry id of the array element to be removed
   */
export function removeFromCachedWeightEntryArray(entryId: string) {
  try {
    const cachedObj = getCachedObject();

    // Checks if the cache is valid and should be updated
    if (cachedObj === null) {
        // Exits the function is the cache does not exist or is expired
        return;
    }

    const updatedArray = cachedObj.weightEntryArray;

    // Finds the index of the entry to be removed
    const entryIndex = updatedArray.findIndex((entry) => entry.weightEntryId === entryId);

    const removedEntry = updatedArray.splice(entryIndex, 1);

    // Checks if at least one entry was removed and if the entry id matches the passed in value
    if (removedEntry.length === 1 && removedEntry[0].weightEntryId === entryId) {
      // Initializes a new cache object with the updated array and existing expiration time
      const updatedCacheObj: CachedObj = {expirationTime: cachedObj.expirationTime, weightEntryArray: updatedArray}
      // Stores the updated array with the existing expiration time
      storeCachedObject(updatedCacheObj);
    }
  } catch (error) {
    // Catches and logs any error
    console.error("Session Storage Removing\n", error);
  }
}
