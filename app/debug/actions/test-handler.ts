import type { ApiEndPointDebugTests } from "@/app/libs/types";
import { testConnection } from "./connection-test";
import { testAccountsEndpoint } from "./account-tests";
import { testGoalWeightEntryEndpoint } from "./goal-entry-tests";
import { testWeightEntryEndpoint } from "./weight-entry-tests";
import { removeUserAccountService } from "@/app/services/accounts";
import { removeGoalWeightEntryService } from "@/app/services/goal-weight-entry";
import { verifyAccountPayload } from "@/app/libs/payload-generation";

export async function apiEndpointTestHandler(
  userName: string,
  userPassword: string,
) {
  const endPointTestIndicators: ApiEndPointDebugTests = {
    connectionTest: "",
    accountCreation: "",
    accountLogin: "",
    goalWeightCreation: "",
    goalWeightRetrieval: "",
    goalWeightUpdate: "",
    weightEntryCreation: "",
    weightEntriesRetrieval: "",
    weightEntryRetrieval: "",
    weightEntryUpdate: "",
    weightEntryRemoval: "",
    accountCleanUp: "",
    goalWeightEntryCleanUp: "",
  };
  let isAccountCreated = false;
  let newUserToken: string = "";
  let isGoalWeightCreated = false;
  let newGoalWeightEntryId: string = "";

  try {
    // Runs the connection test
    const isTestSuccessful = await testConnection();

    // Checks if the test was successful
    if (isTestSuccessful) {
      // Updates the indicator to denote a success and continues to the next test
      endPointTestIndicators.connectionTest = "Connection Test Succeeded";
    } else {
      // Updates the indicator to denote a fail and returns the test indicators to prevent any further testing
      endPointTestIndicators.connectionTest = "Connection Test Failed";
      return endPointTestIndicators;
    }

    // Calls the function to test user accounts
    const userToken = await testAccountsEndpoint(
      endPointTestIndicators,
      userName,
      userPassword,
    );

    // Checks if the accounts tests return a valid token
    if (userToken === null) {
      // Halts further testing if so
      return endPointTestIndicators;
    } else {
      // Else updates the clean up variables
      isAccountCreated = true;
      newUserToken = userToken;
    }

    // Calls the function to test the various goal weight entry endpoints
    const goalWeightEntryId = await testGoalWeightEntryEndpoint(
      endPointTestIndicators,
      userToken,
    );

    // Checks if the goalWeightEntry tests return a entry id
    if (goalWeightEntryId !== null) {
      // if so updates the clean up variables
      newGoalWeightEntryId = goalWeightEntryId;
      isGoalWeightCreated = true;
    }

    // Calls the function to test the various weight entry endpoints
    await testWeightEntryEndpoint(endPointTestIndicators, userToken);
  } catch (error) {
    throw error;
  } finally {
    // Checks if a user account was created before attempting to remove the account
    if (isAccountCreated) {
      await removeUserAccountService(userName, userPassword);
      endPointTestIndicators.accountCleanUp = "Account Removed";
    }

    // Checks if a new goal weight entry was created and that the required clean up vars are assigned before attempting to remove the goal weight entry
    if (
      isGoalWeightCreated &&
      newUserToken !== "" &&
      newGoalWeightEntryId !== ""
    ) {
      const userAccount = await verifyAccountPayload(newUserToken);
      await removeGoalWeightEntryService(newGoalWeightEntryId, userAccount);
      endPointTestIndicators.goalWeightEntryCleanUp =
        "Goal Weight Entry Removed";
    }

    // Returns the endpoint test indicators
    return endPointTestIndicators;
  }
}
