"use client";
import { useRef, useState } from "react";
import { testConnection } from "../actions/connection-test";
import { getUnknownError } from "@/app/utils/errors";
import {
  testAccountCreation,
  testAccountLogin,
} from "../actions/account-tests";
import LabeledInput from "@/app/components/labeled-input";
import Button from "@/app/components/button";
import { testGoalWeightCreation, testGoalWeightRetrieval, testGoalWeightUpdate } from "../actions/goal-entry-tests";

interface ApiDebugProps {}

// Test database connection
// Create account
// login to account
// create goal weight
// get goal weight
// update goal weight
// create weight entry
// get weight entries
// get single weight entry
// update weight entry
// delete weight entry
// delete goal weight
// delete user account

/**
 * Launches various fetch calls to the api endpoints and reports their results
 */
export default function ApiDebug({}: ApiDebugProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [testData, setTestData] = useState<string>("");

  const userNameInputRef = useRef<HTMLInputElement | null>(null);
  const passWordInputRef = useRef<HTMLInputElement | null>(null);

  async function startTests() {
    try {
      let userName: string = "";
      let userPassword: string = "";

      // Confirms that the inputs are valid for the temporary username and password inputs
      if (
        userNameInputRef.current !== null &&
        passWordInputRef.current !== null
      ) {
        userName = userNameInputRef.current.value;
        userPassword = passWordInputRef.current.value;
      } else {
        throw new Error("Inputs not mounted");
      }

      const isTestSuccessful = await testConnection();

      if (isTestSuccessful) {
        setTestData((prev) => prev += "Connection Test Succeeded\n");
      } else {
        throw new Error("Connection Test Failed");
      }

      const isRegistrationSuccessful = await testAccountCreation(
        userName,
        userPassword,
      );
      if (isRegistrationSuccessful) {
        setTestData((prev) => prev + "Account Creation Succeeded\n");
      } else {
        throw new Error("Account Creation Failed");
      }

      const userToken = await testAccountLogin(userName, userPassword);

      if (userToken !== null) {
        setTestData((prev) => prev + "Account Login Succeeded\n");
      } else {
        throw new Error("Account Login Failed");
      }
      
      const isGoalWeightEntryCreated = await testGoalWeightCreation(userToken);

      if (isGoalWeightEntryCreated) {
        setTestData((prev) => prev + "Goal Weight Entry Creation Succeeded\n");
      } else {
        throw new Error("Goal Weight Entry Creation Failed");
      }
      
      const goalWeightEntryId = await testGoalWeightRetrieval(userToken);
      
      if (goalWeightEntryId !== null) {
          setTestData((prev) => prev + "Goal Weight Entry Retrieval Succeeded\n");
        } else {
            throw new Error("Goal Weight Entry Retrieval Failed");
        }
        
        const isGoalWeightEntryUpdated = await testGoalWeightUpdate(userToken, goalWeightEntryId);
  
        if (isGoalWeightEntryUpdated) {
          setTestData((prev) => prev + "Goal Weight Entry Update Succeeded\n");
        } else {
          throw new Error("Goal Weight Entry Update Failed");
        }

    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(getUnknownError());
      }
    }
  }

  return (
    <>
      <p>{`${testData}`}</p>

      <LabeledInput
        id="Username"
        label="Username"
        inputType="text"
        disabled={isLoading}
        ref={userNameInputRef}
      />
      <LabeledInput
        id="Password"
        label="Password"
        inputType="password"
        disabled={isLoading}
        ref={passWordInputRef}
      />
      <Button onClick={startTests} className="p-3">
        Test
      </Button>
    </>
  );
}
