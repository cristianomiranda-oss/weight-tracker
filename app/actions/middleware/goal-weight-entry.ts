"use server";

import { getUserCookie } from "@/app/libs/cookies";
import { errorCausesObj, handleMiddleWareErrors } from "@/app/utils/errors";
import type { GoalOption, GoalWeightEntryType } from "@/app/libs/types";
import { verifyAccountPayload } from "../../libs/payload-generation";
import { addGoalWeightEntryService, changeGoalWeighEntryService, getGoalWeightEntryService } from "@/app/services/goal-weight-entry";

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
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    // Calls the service to add a new goal weight entry
    await addGoalWeightEntryService(weightValue, goalType, payloadData);
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}

/**
 * Middleware for accessing a goal weight entries associated with a user.
 * The currently stored user account cookie is used for identifying what entry is associated with the user.
 * Returns a null value if no goal weight entry is stored for the user.
 * @throws Signals the process failed
 */
export async function getGoalWeightEntry(): Promise<GoalWeightEntryType | null> {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    // Calls the service to retrieve the user's goal weight entry and returns it
    const userGoalWeightEntry = await getGoalWeightEntryService(payloadData);
    return userGoalWeightEntry;
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
  goalWeightEntryId: string,
  weightValue: number,
  goalType: GoalOption,
) {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    // Calls the service to update the goal weight entry
    await changeGoalWeighEntryService(goalWeightEntryId, weightValue, goalType, payloadData);
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}
