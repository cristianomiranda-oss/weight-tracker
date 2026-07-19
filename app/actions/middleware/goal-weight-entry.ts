"use server";

import { getUserCookie } from "@/app/libs/cookies";
import type { GoalWeightEntryType } from "@/app/libs/types";

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