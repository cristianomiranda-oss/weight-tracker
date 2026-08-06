"use server";
import { errorCausesObj } from "@/app/utils/errors";
import type { UserPayloadObj, WeightEntryType } from "@/app/libs/types";
import { WeightTrackerDataBase } from "../libs/mongodb";

/**
 * Service for accessing the database to create new weight entry
 * @param weightValue Number value for the new weight entry - Must be greater than zero
 * @param weighInDate Date value for the new weight entry
 * @param userAccount User account data for the new weight entry
 * @throws Signals the process failed
 */
export async function addWeightEntryService(
  weightValue: number,
  weighInDate: string,
  userAccount: UserPayloadObj,
): Promise<void> {
  try {
    if (weightValue < 0 || Number.isNaN(weightValue)) {
      throw new Error("Weight value cannot be less than zero", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    // Checks if the passed in date string is empty
    if (weighInDate === "") {
      throw new Error("Weigh in date cannot be blank", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    const newEntryId = await WeightTrackerDataBase.createWeightEntry(
      weightValue,
      weighInDate,
      userAccount.userId,
    );

    if (newEntryId) {
      return;
    } else {
      throw new Error("Failed to add new weight entry", {
        cause: errorCausesObj.databaseCrudError,
      });
    }
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}

/**
 * Service for accessing weight entries associated with a user account.
 * The passed in user account data is used for identifying what entry is associated with the user.
 * @param userAccount User account data for accessing associated weight entries
 * @throws Signals the process failed
 */
export async function getWeightEntriesService(
  userAccount: UserPayloadObj,
): Promise<WeightEntryType[]> {
  try {
    const userWeightEntries = await WeightTrackerDataBase.readWeightEntries(
      userAccount.userId,
    );

    return userWeightEntries;
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}

/**
 * Service for accessing a weight entry associated with a user account.
 * The passed in user account data is used for identifying what entry is associated with the user.
 * @param weightEntryId Weight Entry Id for the associated weight entry
 * @param userAccount User account data associated with the weight entry
 * @throws Signals the process failed or
 * @returns The entry associated with the id or if no entry is found, null is returned
 */
export async function getWeightEntryService(
  weightEntryId: string,
  userAccount: UserPayloadObj,
): Promise<WeightEntryType | null> {
  try {
    // Checks if the entry id is the standard uuid length
    if (weightEntryId.length !== 36) {
      throw new Error("Existing weight entry id is invalid", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    const userWeightEntry = await WeightTrackerDataBase.readWeightEntry(
      weightEntryId,
      userAccount.userId,
    );

    return userWeightEntry;
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}

/**
 * Service for accessing the database to update an existing weight entry
 * @param weightEntryId Id for the associated weight entry to be changed - Must be greater than zero
 * @param weightValue New number value for the weight entry - Must be greater than zero
 * @param weighInDate New date value for the weight entry
 * @param userAccount User account data associated with the to be updated weight entry
 * @throws Signals the process failed
 */
export async function changeWeighEntryService(
  weightEntryId: string,
  weightValue: number,
  weighInDate: string,
  userAccount: UserPayloadObj,
): Promise<void> {
  try {
    // Checks if the entry id is the standard uuid length
    if (weightEntryId.length !== 36) {
      throw new Error("Existing weight entry id is invalid", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (weightValue < 0 || Number.isNaN(weightValue)) {
      throw new Error("Weight value cannot be less than zero", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    // Checks if the passed in date string is empty
    if (weighInDate === "") {
      throw new Error("Weigh in date cannot be blank", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    const isEntryUpdated = await WeightTrackerDataBase.updateWeightEntry(
      weightEntryId,
      weightValue,
      weighInDate,
      userAccount.userId,
    );

    if (isEntryUpdated) {
      return;
    } else {
      throw new Error("Failed to update weight entry", {
        cause: errorCausesObj.databaseCrudError,
      });
    }
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}

/**
 * Services for removing specific weight entries from the database.
 * Entries are identified based on the stored user account cookie and the passed in entryId value.
 * @param entryId Id value for the entry to be removed.
 * @param userAccount User account data associated with the to be removed weight entry
 * @throws Signals the process failed
 */
export async function removeWeightEntryService(
  weightEntryId: string,
  userAccount: UserPayloadObj,
): Promise<void> {
  try {
    // Checks if the entry id is the standard uuid length
    if (weightEntryId.length !== 36) {
      throw new Error("Existing weight entry id is invalid", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    const isEntryDeleted: boolean =
      await WeightTrackerDataBase.deleteWeightEntry(
        weightEntryId,
        userAccount.userId,
      );

    if (isEntryDeleted) {
      return;
    } else {
      throw new Error("Failed to access weight entries", {
        cause: errorCausesObj.processFail,
      });
    }
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}
