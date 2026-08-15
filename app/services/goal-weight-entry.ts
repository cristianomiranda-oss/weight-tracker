"use server";

import { errorCausesObj } from "@/app/utils/errors";
import type {
  GoalOption,
  GoalWeightEntryType,
  UserPayloadObj,
} from "@/app/libs/types";
import { WeightTrackerDataBase } from "../libs/mongodb";
import { FilterTests } from "../utils/regex";

/**
 * Service for accessing the database to create a new goal weight entry
 * @param weightValue Number value for the new goal weight entry
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
    // Validates the UUID value for the user account and goal weight entry and throws an error if it is invalid
    FilterTests.validateUUID(userAccount.userId);

    // Tests the weight value and throws an error if it is invalid
    FilterTests.validateWeightValue(weightValue);

    // Tests the goal type and throws an error if it is invalid
    FilterTests.validateGoalType(goalType);

    const newGoalWeightEntryId =
      await WeightTrackerDataBase.createGoalWeightEntry(
        weightValue,
        goalType,
        userAccount.userId,
      );

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
    // Validates the UUID value for the user account and throws an error if it is invalid
    FilterTests.validateUUID(userAccount.userId);

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
 * @param goalWeightEntryId New number value for the existing goal weight entry
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
    // Validates the UUID value for the user account and goal weight entry and throws an error if it is invalid
    FilterTests.validateUUID(userAccount.userId);
    FilterTests.validateUUID(goalWeightEntryId);

    // Tests the weight value and throws an error if it is invalid
    FilterTests.validateWeightValue(weightValue);

    // Tests the goal type and throws an error if it is invalid
    FilterTests.validateGoalType(goalType);

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

/**
 * DEBUG: Services for removing a goal weight entry from the database.
 * Entries are identified based on the user account and the passed in entryId value.
 * Debug only method, is not used outside of testing purposes
 * @param entryId Id value for the entry to be removed.
 * @param userAccount User account data associated with the to be removed weight entry
 * @throws Signals the process failed
 */
export async function removeGoalWeightEntryService(
  goalWeightEntryId: string,
  userAccount: UserPayloadObj,
): Promise<void> {
  try {
    // Validates the UUID value for the user account and weight entry id and throws an error if it is invalid
    FilterTests.validateUUID(userAccount.userId);
    FilterTests.validateUUID(goalWeightEntryId);

    const isEntryDeleted = await WeightTrackerDataBase.deleteGoalWeightEntry(
      goalWeightEntryId,
      userAccount.userId,
    );

    if (isEntryDeleted) {
      return;
    } else {
      throw new Error("Failed to access goal weight entries", {
        cause: errorCausesObj.processFail,
      });
    }
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}
