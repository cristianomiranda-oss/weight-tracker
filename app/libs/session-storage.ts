"use client";
import { minutesToMilliseconds } from "../utils/time";
import type {
  CachedObj,
  GoalOption,
  GoalWeightEntryType,
  WeightEntryType,
} from "./types";

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
  static _storeCachedObject<CacheObj>(cacheKey: string, cachedObj: CacheObj) {
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
  static _getCachedObject<CacheType>(cacheKey: string) {
    try {
      const cachedObjStr = sessionStorage.getItem(cacheKey);

      if (cachedObjStr === null) {
        return null;
      }

      // Parses the string into an object and uses the passed in type to define the data type on the object
      const cachedObj: CachedObj<CacheType> = JSON.parse(cachedObjStr);

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

      // Initializes the cached object and sets its typing for the data value to the weight entry type
      const cachedObj: CachedObj<WeightEntryType[]> = {
        expirationTime,
        cacheData: weightEntryArray,
      };

      // Stores the object, and the weight entry type is passed as the cache type
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
      const cachedObj = this._getCachedObject<WeightEntryType[]>(
        this._weightEntriesKey,
      );

      if (cachedObj === null) {
        return null;
      }

      // Returns the cached weight entry array
      return cachedObj.cacheData;
    } catch (error) {
      // Catches and logs any error and returns null
      console.error("Session Storage Retrieval Weight Entries Array\n", error);
      return null;
    }
  }

  /**
   * Updates an entry in the cached array. If the cached array is expired, the process is forgone.
   * The cached array is updated but the expiration time remains the same.
   *
   * @param entryId The entry id of the array element to be removed
   * @param newWeightValue The new weight value to be saved
   * @param newWeighInDate The new date to be saved
   */
  static updateCachedWeightEntryArray(
    entryId: string,
    newWeightValue: number,
    newWeighInDate: string,
  ) {
    try {
      const cachedObj = this._getCachedObject<WeightEntryType[]>(
        this._weightEntriesKey,
      );

      // Checks if the cache is valid and should be updated
      if (cachedObj === null) {
        // Exits the function is the cache does not exist or is expired
        return;
      }

      const updatedArray = cachedObj.cacheData;

      // Iterates through the array until the entry is found
      for (let i = 0; i < updatedArray.length; i++) {
        // Checks if the entry's id matches the passed in entry id
        if (updatedArray[i]._id === entryId) {
          // Updates the entry in the array
          updatedArray[i].weightValue = newWeightValue;
          updatedArray[i].weighInDate = newWeighInDate;

          // Initializes a new cache object with the updated array and existing expiration time
          const updatedCacheObj: CachedObj<WeightEntryType[]> = {
            expirationTime: cachedObj.expirationTime,
            cacheData: updatedArray,
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
   * @param entryId The entry id of the array element to be removed
   */
  static removeFromCachedWeightEntryArray(entryId: string) {
    try {
      const cachedObj = this._getCachedObject<WeightEntryType[]>(
        this._weightEntriesKey,
      );

      // Checks if the cache is valid and should be updated
      if (cachedObj === null) {
        // Exits the function is the cache does not exist or is expired
        return;
      }

      const updatedArray = cachedObj.cacheData;

      // Finds the index of the entry to be removed
      const entryIndex = updatedArray.findIndex(
        (entry) => entry._id === entryId,
      );

      if (entryIndex === -1) {
        throw new Error("Invalid Entry Id");
      }

      const removedEntry = updatedArray.splice(entryIndex, 1);

      // Checks if at least one entry was removed and if the entry id matches the passed in value
      if (removedEntry.length === 1 && removedEntry[0]._id === entryId) {
        // Initializes a new cache object with the updated array and existing expiration time
        const updatedCacheObj: CachedObj<WeightEntryType[]> = {
          expirationTime: cachedObj.expirationTime,
          cacheData: updatedArray,
        };
        // Stores the updated array with the existing expiration time
        this._storeCachedObject(this._weightEntriesKey, updatedCacheObj);
      }
    } catch (error) {
      // Catches and logs any error
      console.error(
        "Session Storage Removing From Weight Entry Array\n",
        error,
      );
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

  /**
   * Stores the passed in goal weight entry and assigns it an expiration time before storing in session storage
   * @param goalWeightEntry The goal weight entry to be stored.
   */
  static cacheGoalWeightEntry(goalWeightEntry: GoalWeightEntryType) {
    try {
      // Calculates the expiration time, one minute after the time of storing
      const expirationTime = Date.now() + minutesToMilliseconds(1);

      // Initializes the cached object
      const cachedObj: CachedObj<GoalWeightEntryType> = {
        expirationTime,
        cacheData: goalWeightEntry,
      };

      // Stores the object
      this._storeCachedObject(this._goalWeightEntryKey, cachedObj);
    } catch (error) {
      // Catches and logs any error
      console.error("Session Storage Storing Goal Weight Entry\n", error);
    }
  }

  /**
   * Gets the cached weight entry array from storage but checks if the cached array is expired before returning.
   * @returns Returns null if the session storage is empty or the cached array has expired.
   */
  static getCachedGoalWeightEntry(): GoalWeightEntryType | null {
    try {
      const cachedObj = this._getCachedObject<GoalWeightEntryType>(
        this._goalWeightEntryKey,
      );

      if (cachedObj === null) {
        return null;
      }

      // Returns the cached weight entry array
      return cachedObj.cacheData;
    } catch (error) {
      // Catches and logs any error and returns null
      console.error("Session Storage Retrieval Goal Weight Entry\n", error);
      return null;
    }
  }

  /**
   * Updates the cached goal weight entry.
   * The cached entry is updated but the expiration time remains the same.
   *
   * @param entryId The entry id of the array element to be removed
   * @param newWeightValue The new weight value to be saved
   * @param newWeighInDate The new date to be saved
   */
  static updateCachedGoalWeightEntry(
    entryId: string,
    newWeightValue: number,
    newGoalType: GoalOption,
  ) {
    try {
      const cachedObj = this._getCachedObject<GoalWeightEntryType>(
        this._goalWeightEntryKey,
      );

      // Checks if the cache is valid and should be updated
      if (cachedObj === null) {
        // Exits the function is the cache does not exist or is expired
        return;
      }

      const cachedGoalWeightEntry = cachedObj.cacheData;

      // Checks if the cached entry's id matches the passed in entry id
      if (entryId !== cachedGoalWeightEntry._id) {
        throw new Error("Cached Goal Weight Entry does not match");
      }

      cachedGoalWeightEntry.goalType = newGoalType;
      cachedGoalWeightEntry.weightValue = newWeightValue;

      // Initializes a new cache object with the updated goal weight entry and existing expiration time
      const updatedCacheObj: CachedObj<GoalWeightEntryType> = {
        expirationTime: cachedObj.expirationTime,
        cacheData: cachedGoalWeightEntry,
      };

      this._storeCachedObject(this._goalWeightEntryKey, updatedCacheObj);
    } catch (error) {
      // Catches and logs any error
      console.error("Session Storage Updating Goal Weight Entry\n", error);
    }
  }

  /**
   * Clears the cached goal weight entry
   */
  static clearCachedGoalWeightEntry() {
    try {
      sessionStorage.removeItem(this._goalWeightEntryKey);
    } catch (error) {
      // Catches and logs any error
      console.error("Session Storage Clear Goal Weight Entry\n", error);
    }
  }
}
