import type {
  ApiEndPointDebugTests,
  ApiEndpointResponse,
} from "@/app/libs/types";
import { FilterTests } from "@/app/utils/regex";

/**
 * Tests the '/api/weight-entry' endpoint GET method.
 * Attempts to retrieve all entries for the user.
 * @returns Returns the first entry retrieved from the request id value, or returns null if retrieval failed or an error occurred
 */
export async function testWeightEntriesRetrieval(userToken: string) {
  try {
    if (userToken === "") {
      throw new Error("Invalid User Token");
    }

    const retrievalResult = await fetch("/api/weight-entry", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    const responseData = (await retrievalResult.json()) as ApiEndpointResponse;

    // Checks if the appropriate message and weight entries were received
    if (
      responseData.message === "Entries Retrieved" &&
      responseData.weightEntries !== undefined
    ) {
      // Returns the id data of the first entry
      return responseData.weightEntries[0]._id;
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
 * Tests the '/api/weight-entry' endpoint GET method.
 * Attempts to retrieve a specific entry for the user.
 * @returns Returns a boolean denoting if the test was successful.
 * True if successful, false if retrieval failed or an error occurred.
 */
async function testWeightEntryRetrieval(
  userToken: string,
  weightEntryId: string,
) {
  try {
    if (userToken === "") {
      throw new Error("Invalid User Token");
    }

    FilterTests.validateUUID(weightEntryId);

    const retrievalResult = await fetch("/api/weight-entry", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
        weightEntryId: weightEntryId, // Adds the necessary header to the request
      },
    });

    const responseData = (await retrievalResult.json()) as ApiEndpointResponse;

    // Checks if the appropriate message and weight entry was received
    if (
      responseData.message === "Entry Retrieved" &&
      responseData.weightEntry !== undefined
    ) {
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
 * Tests the '/api/weight-entry' endpoint POST method
 * @returns Returns a boolean denoting if the test was successful.
 * True if successful, false if creation failed or an error occurred
 */
async function testWeightEntryCreation(userToken: string) {
  try {
    if (userToken === "") {
      throw new Error("Invalid User Token");
    }

    const newWeightEntry = {
      weightValue: 190,
      weighInDate: "2026-08-12T14:14",
    };

    const creationResult = await fetch("/api/weight-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(newWeightEntry),
    });

    const responseData = (await creationResult.json()) as ApiEndpointResponse;

    // Checks if the appropriate message was received
    if (responseData.message === "Weight Entry Added") {
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
 * Tests the '/api/weight-entry' endpoint PUT method
 * @returns Returns a boolean denoting if the test was successful.
 * True if updating was successful, false if updating failed or an error occurred
 */
async function testWeightEntryUpdate(userToken: string, weightEntryId: string) {
  try {
    if (userToken === "") {
      throw new Error("Invalid User Token");
    }

    FilterTests.validateUUID(weightEntryId);

    const newWeightEntryData = {
      weightEntryId: weightEntryId,
      weightValue: 200,
      weighInDate: "2026-08-16T14:14",
    };

    const creationResult = await fetch("/api/weight-entry", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(newWeightEntryData),
    });

    const responseData = (await creationResult.json()) as ApiEndpointResponse;

    // Checks if the appropriate message was received
    if (responseData.message === "Weight Entry Updated") {
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
 * Tests the '/api/weight-entry' endpoint delete method
 * @returns Returns a boolean denoting if the test was successful.
 * True if deletion was successful, false if deletion failed or an error occurred
 */
async function testWeightEntryRemoval(
  userToken: string,
  weightEntryId: string,
) {
  try {
    if (userToken === "") {
      throw new Error("Invalid User Token");
    }

    FilterTests.validateUUID(weightEntryId);

    const newWeightEntryData = {
      weightEntryId: weightEntryId,
    };

    const creationResult = await fetch("/api/weight-entry", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(newWeightEntryData),
    });

    const responseData = (await creationResult.json()) as ApiEndpointResponse;

    // Checks if the appropriate message was received
    if (responseData.message === "Weight Entry Deleted") {
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
 */
export async function testWeightEntryEndpoint(
  endPointTestIndicators: ApiEndPointDebugTests,
  userToken: string,
) {
  // Calls the function to test weight entry creation
  const isWeightEntryCreated = await testWeightEntryCreation(userToken);

  if (isWeightEntryCreated) {
    endPointTestIndicators.weightEntryCreation =
      "Weight Entry Creation Succeeded";
  } else {
    endPointTestIndicators.weightEntryCreation = "Weight Entry Creation Failed";
    // Exits to prevent any further testing
    return;
  }
  // Calls the function to test the goal weight entry creation
  const weightEntryId = await testWeightEntriesRetrieval(userToken);

  if (weightEntryId !== null) {
    endPointTestIndicators.weightEntriesRetrieval =
      "Weight Entries Retrieval Succeeded";
  } else {
    endPointTestIndicators.weightEntriesRetrieval =
      "Weight Entries Retrieval Failed";
    // Exits to prevent any further testing
    return;
  }

  // Calls the function to test the weight entry retrieval
  const isWeightEntryRetrieved = await testWeightEntryRetrieval(
    userToken,
    weightEntryId,
  );

  if (isWeightEntryRetrieved) {
    endPointTestIndicators.weightEntryRetrieval =
      "Weight Entry Retrieval Succeeded";
  } else {
    endPointTestIndicators.weightEntryRetrieval =
      "Weight Entry Retrieval Failed";
    // Exits to prevent any further testing
    return;
  }

  // Calls the function to test the weight entry updating
  const isWeightEntryUpdated = await testWeightEntryUpdate(
    userToken,
    weightEntryId,
  );

  if (isWeightEntryUpdated) {
    endPointTestIndicators.weightEntryUpdate =
      "Weight Entry Update Succeeded";
  } else {
    endPointTestIndicators.weightEntryUpdate =
      "Weight Entry Update Failed";
    // Exits to prevent any further testing
    return;
  }

  // Calls the function to test the goal weight entry updating
  const isWeightEntryRemoved = await testWeightEntryRemoval(
    userToken,
    weightEntryId,
  );

  if (isWeightEntryRemoved) {
    endPointTestIndicators.weightEntryRemoval =
      "Weight Entry Removal Succeeded";
  } else {
    endPointTestIndicators.weightEntryRemoval = "Weight Entry Removal Failed";
  }

  // Exits the function
  return;
}
