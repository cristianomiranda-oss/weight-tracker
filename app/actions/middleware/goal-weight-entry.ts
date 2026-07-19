"use server";

import { getUserCookie } from "@/app/libs/cookies";
import type { GoalOption, GoalWeightEntryType } from "@/app/libs/types";

/**
 * Middleware for accessing a goal weight entries associated with a user.
 * The currently stored user account cookie is used for identifying what entry is associated with the user.
 * @throws Signals the process failed
 */
export async function getGoalWeightEntry(): Promise<GoalWeightEntryType> {
  const userCookie = await getUserCookie();

  if (userCookie === null) {
    throw new Error("Invalid user account", {
      cause: "invalid-user-cookie",
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
    throw new Error("Failed to access weight entries");
  } else {
    return userGoalWeightEntry;
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
) {
  if (weightValue < 0 || Number.isNaN(weightValue)) {
    throw new Error("Weight value cannot be less than zero");
  }

  if (
    goalType === "Maintenance" ||
    goalType === "Gain" ||
    goalType === "Loss"
  ) {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: "invalid-user-cookie",
      });
    }

    // TODO: Create database method to add goal weight entries
    // const isEntryAdded = createGoalWeightEntry(weightValue, goalType, userCookie)
    const isEntryAdded = true;

    if (isEntryAdded) {
      return;
    } else {
      throw new Error("Failed to add new goal weight entry");
    }
  } else {
    throw new Error("Invalid goal type");
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
  if (goalWeightEntryId <= 0) {
    throw new Error("Existing goal weight entry invalid");
  }

  if (weightValue < 0 || Number.isNaN(weightValue)) {
    throw new Error("Weight value cannot be less than 0");
  }

  if (
    goalType === "Maintenance" ||
    goalType === "Gain" ||
    goalType === "Loss"
  ) {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: "invalid-user-cookie",
      });
    }

    // TODO: Create database method to update goal weight entry
    // const isEntryUpdated = updateWeightEntry(weightValue, weighInDate, userCookie)
    const isEntryUpdated = true;

    if (isEntryUpdated) {
      return;
    } else {
      throw new Error("Failed to update new weight entry");
    }
  } else {
    throw new Error("Invalid goal type");
  }
}
