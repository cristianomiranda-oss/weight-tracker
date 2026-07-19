"use server";

import { getUserCookie } from "@/app/libs/cookies";
import { errorCausesObj, handleMiddleWareErrors } from "@/app/libs/errors";
import type { GoalOption, GoalWeightEntryType } from "@/app/libs/types";

function verifyGoalType() {
  
}

/**
 * Middleware for accessing a goal weight entries associated with a user.
 * The currently stored user account cookie is used for identifying what entry is associated with the user.
 * @throws Signals the process failed
 */
export async function getGoalWeightEntry(): Promise<GoalWeightEntryType> {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // TODO: Add database method top get goal weight entry
    // const userGoalWeightEntry: GoalWeightEntryType = readGoalWeightEntry(userCookie);

    // * Temporarily uses a predefined object
    const userGoalWeightEntry: GoalWeightEntryType = {
      goalWeightEntryId: 1,
      weightValue: 140,
      goalType: "Loss",
      userId: 1,
    };

    if (userGoalWeightEntry === null) {
      throw new Error("Failed to access weight entries", {
        cause: errorCausesObj.processFail,
      });
    } else {
      return userGoalWeightEntry;
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}

/**
 * Middleware for accessing the database to create a new goal weight entry
 * @param weightValue Number value for the new goal weight entry - Must be greater than zero
 * @param goalType Goal type for the new goal weight entry - Must be "Loss", "Gain", or "Maintenance"
 * @throws Signals the process failed
 */
export async function addGoalWeightEntry(
  weightValue: number,
  goalType: GoalOption,
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

    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // TODO: Create database method to add goal weight entries
    // const isEntryAdded = createGoalWeightEntry(weightValue, goalType, userCookie)
    const isEntryAdded = true;

    if (isEntryAdded) {
      return;
    } else {
      throw new Error("Failed to add new goal weight entry", {
        cause: errorCausesObj.processFail,
      });
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}

/**
 * Middleware for accessing the database to create a new goal weight entry
 * @param goalWeightEntryId New number value for the new goal weight entry - Must be greater than zero
 * @param weightValue New number value for the existing goal weight entry - Must be greater than zero
 * @param goalType New goal type for the existing goal weight entry - Must be "Loss", "Gain", or "Maintenance"
 * @throws Signals the process failed
 */
export async function changeGoalWeighEntry(
  goalWeightEntryId: number,
  weightValue: number,
  goalType: GoalOption,
) {
  try {
    if (goalWeightEntryId <= 0) {
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

    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // TODO: Create database method to update goal weight entry
    // const isEntryUpdated = updateWeightEntry(weightValue, weighInDate, userCookie)
    const isEntryUpdated = true;

    if (isEntryUpdated) {
      return;
    } else {
      throw new Error("Failed to update new weight entry", {
        cause: errorCausesObj.processFail,
      });
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}
