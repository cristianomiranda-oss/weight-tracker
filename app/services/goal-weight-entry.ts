"use server";

import { errorCausesObj } from "@/app/utils/errors";
import type {
  GoalOption,
  GoalWeightEntryType,
  UserPayloadObj,
} from "@/app/libs/types";
import { WeightTrackerDataBase } from "../libs/mongodb";

/**
 * Service for accessing the database to create a new goal weight entry
 * @param weightValue Number value for the new goal weight entry - Must be greater than zero
 * @param goalType Goal type for the new goal weight entry - Must be "Loss", "Gain", or "Maintenance"
 * @param userAccount User account data for the new goal weight entry
 * @throws Signals the process failed
 */
export async function addGoalWeightEntryService(
  weightValue: number,
  goalType: GoalOption,
  userAccount: UserPayloadObj,
): Promise<void> {
  try {
    if (weightValue < 0 || Number.isNaN(weightValue)) {
      throw new Error("Weight value cannot be less than zero", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    let isValid = false;

    for (const approvedType of ["Loss", "Gain", "Maintenance"]) {
      if (approvedType === goalType) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new Error("Invalid goal type", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    // TODO: Add call to mongodb method
    // const newGoalWeightEntryId = await IndexedDB.createGoalWeightEntry(
    //   weightValue,
    //   goalType,
    //   userAccount.userId,
    // );

    const newGoalWeightEntryId = "a";

    if (newGoalWeightEntryId) {
      return;
    } else {
      throw new Error("Failed to add new goal weight entry", {
        cause: errorCausesObj.databaseCrudError,
      });
    }
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}

/**
 * Service for accessing a goal weight entries associated with a user.
 * The passed in user account data is used for identifying what entry is associated with the user.
 * @param userAccount User account data for the new goal weight entry
 * @throws Signals the process failed
 * @returns Returns a null value if no goal weight entry is stored for the user.
 */
export async function getGoalWeightEntryService(
  userAccount: UserPayloadObj,
): Promise<GoalWeightEntryType | null> {
  try {
    const userGoalWeightEntry = await WeightTrackerDataBase.readGoalWeightEntry(
      userAccount.userId,
    );

    return userGoalWeightEntry;
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}

/**
 * Service for accessing the database to update a goal weight entry
 * @param goalWeightEntryId New number value for the existing goal weight entry - Must be greater than zero
 * @param weightValue New number value for the existing goal weight entry - Must be greater than zero
 * @param goalType New goal type for the existing goal weight entry - Must be "Loss", "Gain", or "Maintenance"
 * @param userAccount User account data associated with the existing goal weight entry
 * @throws Signals the process failed
 */
export async function changeGoalWeighEntryService(
  goalWeightEntryId: string,
  weightValue: number,
  goalType: GoalOption,
  userAccount: UserPayloadObj,
) {
  try {
    // Checks if the entry id is the standard uuid length
    if (goalWeightEntryId.length !== 36) {
      throw new Error("Existing goal weight entry invalid", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (weightValue < 0 || Number.isNaN(weightValue)) {
      throw new Error("Weight value cannot be less than 0", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    let isValid = false;

    for (const approvedType of ["Loss", "Gain", "Maintenance"]) {
      if (approvedType === goalType) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new Error("Invalid goal type", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    const isEntryUpdated = await WeightTrackerDataBase.updateGoalWeightEntry(
      goalWeightEntryId,
      weightValue,
      goalType,
      userAccount.userId,
    );

    if (isEntryUpdated) {
      return;
    } else {
      throw new Error("Failed to update new weight entry", {
        cause: errorCausesObj.databaseCrudError,
      });
    }
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}
