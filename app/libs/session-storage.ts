"use client";
import { minutesToMilliseconds } from "../utils/time";
import type { CachedObj, WeightEntryType } from "./types";

/**
 * Static Methods needed for managing session storage of the weight entries array
 */
export class EntriesSessionStorage {
  static _weightEntriesKey = "weight_entries_cache";
  static _goalWeightEntryKey = "goal_entry_cache";

  /**
   * Stores the passed in object in session storage. The key is defined in this function's file
   * @param cachedObj The object to be stored
   * @param cacheKey The key of the associated item to be retrieved
   */
  static _storeCachedObject(cacheKey: string, cachedObj: CachedObj) {
    try {
      // Stores the object
      sessionStorage.setItem(cacheKey, JSON.stringify(cachedObj));
    } catch (error) {
      // Catches and logs any error
      console.error("Session Storage Setting\n", error);
    }
  }

  /**
   * Retrieves the cached object from session storage, but if the object does not exist or its expiration time has passed a null value is returned
   * @param cacheKey The key of the associated item to be retrieved
   * @returns Returns the cached object if successful and null if the process fails
   */
  static _getCachedObject(cacheKey: string) {
    try {
      const cachedObjStr = sessionStorage.getItem(cacheKey);

      if (cachedObjStr === null) {
        return null;
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

      return cachedObj;
    } catch (error) {
      // Catches and logs any error and returns null
      console.error("Session Storage Getting\n", error);
      return null;
    }
  }

  /**
   * Stores the passed in weight entry and assigns it an expiration time before storing in session storage
   * @param weightEntryArray The weight entry array to be stored.
   */
  static cacheWeightEntryArray(weightEntryArray: WeightEntryType[]) {
    try {
      // Calculates the expiration time, one minute after the time of storing
      const expirationTime = Date.now() + minutesToMilliseconds(1);

      // Initializes the cached object
      const cachedObj: CachedObj = {
        expirationTime,
        weightEntryArray: weightEntryArray,
      };

      // Stores the object
      this._storeCachedObject(this._weightEntriesKey, cachedObj);
    } catch (error) {
      // Catches and logs any error
      console.error("Session Storage Storing Weight Entries Array\n", error);
    }
  }

  /**
   * Gets the cached weight entry array from storage but checks if the cached array is expired before returning.
   * @returns Returns null if the session storage is empty or the cached array has expired.
   */
  static getCachedWeightEntryArray(): WeightEntryType[] | null {
    try {
      const cachedObj = this._getCachedObject(this._weightEntriesKey);

      if (cachedObj === null) {
        return null;
      }

      // Returns the cached weight entry array
      return cachedObj.weightEntryArray;
    } catch (error) {
      // Catches and logs any error and returns null
      console.error("Session Storage Retrieval Weight Entries Array\n", error);
      return null;
    }
  }

  static updateCachedWeightEntryArray(
    entryId: string,
    newWeightValue: number,
    newWeighInDate: string,
  ) {
    try {
      const cachedObj = this._getCachedObject(this._weightEntriesKey);

      // Checks if the cache is valid and should be updated
      if (cachedObj === null) {
        // Exits the function is the cache does not exist or is expired
        return;
      }

      const updatedArray = cachedObj.weightEntryArray;

      // Iterates through the array until the entry is found
      for (let i = 0; i < updatedArray.length; i++) {
        // Checks if the entry's id matches the passed in entry id
        if (updatedArray[i]._id === entryId) {
          // Updates the entry in the array
          updatedArray[i].weightValue = newWeightValue;
          updatedArray[i].weighInDate = newWeighInDate;

          // Initializes a new cache object with the updated array and existing expiration time
          const updatedCacheObj: CachedObj = {
            expirationTime: cachedObj.expirationTime,
            weightEntryArray: updatedArray,
          };
          // Stores the updated array with the existing expiration time
          this._storeCachedObject(this._weightEntriesKey, updatedCacheObj);

          // Exits the function;
          return;
        }
      }

      // Throws an error indicating the entry id was invalid
      throw new Error("Invalid Entry Id");
    } catch (error) {
      // Catches and logs any error
      console.error("Session Storage Updating Weight Entry Array\n", error);
    }
  }

  /**
   * Removes an entry from the cached array. If the cached array is expired, the process is forgone.
   * The cached array is updated but the expiration time remains the same.
   *
   * @param {string} entryId The entry id of the array element to be removed
   */
  static removeFromCachedWeightEntryArray(entryId: string) {
    try {
      const cachedObj = this._getCachedObject(this._weightEntriesKey);

      // Checks if the cache is valid and should be updated
      if (cachedObj === null) {
        // Exits the function is the cache does not exist or is expired
        return;
      }

      const updatedArray = cachedObj.weightEntryArray;

      // Finds the index of the entry to be removed
      const entryIndex = updatedArray.findIndex(
        (entry) => entry._id === entryId,
      );

      const removedEntry = updatedArray.splice(entryIndex, 1);

      // Checks if at least one entry was removed and if the entry id matches the passed in value
      if (removedEntry.length === 1 && removedEntry[0]._id === entryId) {
        // Initializes a new cache object with the updated array and existing expiration time
        const updatedCacheObj: CachedObj = {
          expirationTime: cachedObj.expirationTime,
          weightEntryArray: updatedArray,
        };
        // Stores the updated array with the existing expiration time
        this._storeCachedObject(this._weightEntriesKey, updatedCacheObj);
      }
    } catch (error) {
      // Catches and logs any error
      console.error("Session Storage Removing From Weight Entry Array\n", error);
    }
  }

  /**
   * Clears the cached weight entry
   */
  static clearCachedWeightEntryArray() {
    try {
      sessionStorage.removeItem(this._weightEntriesKey);
    } catch (error) {
      // Catches and logs any error
      console.error("Session Storage Clear Weight Entry Array\n", error);
    }
  }

  
}
