import { addGoalWeightEntry } from "@/app/actions/middleware/goal-weight-entry";
import type { ApiEndpointResponse } from "@/app/libs/types";
import { FilterTests } from "@/app/utils/regex";

/**
 * Tests the '/api/goal-weight-entry' endpoint GET method
 * @returns Returns the retrieved entry's id if successful, and returns null if retrieval fails or an error occurs
 */
export async function testGoalWeightRetrieval(userToken: string) {
  try {
    if (userToken === "") {
      throw new Error("Invalid User Token");
    }

    const creationResult = await fetch("/api/goal-weight-entry", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    const responseData = (await creationResult.json()) as ApiEndpointResponse;

    // Checks if the appropriate message and goal weight entry was received
    if (
      responseData.message === "Goal Weight Entry Added" &&
      responseData.goalWeightEntry !== undefined
    ) {
      return responseData.goalWeightEntry._id;
    } else {
      // Throws an error containing the received message
      throw new Error(responseData.message);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Tests the '/api/goal-weight-entry' endpoint POST method
 * @returns Returns a boolean denoting if the test was successful.
 * True if successful, false if creation failed or an error occurred
 */
export async function testGoalWeightCreation(userToken: string) {
  try {
    if (userToken === "") {
      throw new Error("Invalid User Token");
    }

    const newGoalWeightEntryData = {
      weightValue: 143,
      goalType: "Loss",
    };

    const creationResult = await fetch("/api/goal-weight-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(newGoalWeightEntryData),
    });

    const responseData = (await creationResult.json()) as ApiEndpointResponse;

    // Checks if the appropriate message and goal weight entry was received
    if (responseData.message === "Goal Weight Entry Added") {
      return true;
    } else {
      // Throws an error containing the received message
      throw new Error(responseData.message);
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * Tests the '/api/goal-weight-entry' endpoint PUT method
 * @returns Returns a boolean denoting if the test was successful.
 * True if updating was successful, false if updating failed or an error occurred
 */
export async function testGoalWeightUpdate(
  userToken: string,
  goalWeightEntryId: string,
) {
  try {
    if (userToken === "") {
      throw new Error("Invalid User Token");
    }

    FilterTests.validateUUID(goalWeightEntryId);

    const newGoalWeightEntryData = {
      goalWeightEntryId: goalWeightEntryId,
      weightValue: 185,
      goalType: "Gain",
    };

    const creationResult = await fetch("/api/goal-weight-entry", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(newGoalWeightEntryData),
    });

    const responseData = (await creationResult.json()) as ApiEndpointResponse;

    // Checks if the appropriate message and goal weight entry was received
    if (responseData.message === "Goal Weight Entry Updated") {
      return true;
    } else {
      // Throws an error containing the received message
      throw new Error(responseData.message);
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
