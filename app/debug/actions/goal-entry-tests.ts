import type {
  ApiEndPointDebugTests,
  ApiEndpointResponse,
} from "@/app/libs/types";
import { FilterTests } from "@/app/utils/regex";

/**
 * Tests the '/api/goal-weight-entry' endpoint GET method
 * @returns Returns the retrieved entry's id if successful, and returns null if retrieval fails or an error occurs
 */
async function testGoalWeightRetrieval(userToken: string) {
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
      responseData.message === "Goal Weight Entry Retrieved" &&
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
async function testGoalWeightCreation(userToken: string) {
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
async function testGoalWeightUpdate(
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

/**
 * Tests all goal Weight Entry endpoints. Attempts to create, retrieve, and update a goal weight entry.
 * If any test fails in the process, the remaining are skipped.
 * @param endPointTestIndicators The object containing the test indicators that will be updated based on the results of the tests
 * @param userToken The valid token for the temporary account
 * @returns Returns the new goal weight entry's id or null if the entry's id is not accessible
 */
export async function testGoalWeightEntryEndpoint(
  endPointTestIndicators: ApiEndPointDebugTests,
  userToken: string,
) {
  // Calls the function to test the goal weight entry creation
  const isGoalWeightEntryCreated = await testGoalWeightCreation(userToken);

  if (isGoalWeightEntryCreated) {
    endPointTestIndicators.goalWeightCreation =
      "Goal Weight Entry Creation Succeeded";
  } else {
    //
    endPointTestIndicators.goalWeightCreation =
      "Goal Weight Entry Creation Failed";
    // Exits to prevent any further testing and returns null to denote the entry is not accessible during clean up
    return null;
  }

  // Calls the function to test the goal weight entry retrieval
  const goalWeightEntryId = await testGoalWeightRetrieval(userToken);

  if (goalWeightEntryId !== null) {
    endPointTestIndicators.goalWeightRetrieval =
      "Goal Weight Entry Retrieval Succeeded";
  } else {
    endPointTestIndicators.goalWeightRetrieval =
      "Goal Weight Entry Retrieval Failed";
    // Exits to prevent any further testing and returns null to denote the entry is not accessible during clean up
    return null;
  }

  // Calls the function to test the goal weight entry updating
  const isGoalWeightEntryUpdated = await testGoalWeightUpdate(
    userToken,
    goalWeightEntryId,
  );

  if (isGoalWeightEntryUpdated) {
    endPointTestIndicators.goalWeightUpdate =
      "Goal Weight Entry Update Succeeded";
  } else {
    endPointTestIndicators.goalWeightUpdate = "Goal Weight Entry Update Failed";
  }

  // Returns the goalWeightEntryId regardless of the final test outcome to allow for its removal during clean up
  return goalWeightEntryId;
}
