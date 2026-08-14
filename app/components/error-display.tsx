import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";
import { errorCausesObj } from "../utils/errors";

interface ErrorDisplayProps {
  error: Error;
  router: AppRouterInstance;
  debug?: boolean
}

/**
 * Displays the error and handles the timing before redirecting user to the appropriate page
 */
export default function ErrorDisplay({ error, router, debug }: ErrorDisplayProps) {
  const [timeCount, setTimeCount] = useState<number>(3);

  function navigateToPage() {
    if (
      error.cause === errorCausesObj.invalidUserCookie ||
      error.cause === errorCausesObj.accessDenied
    ) {
      // Redirects the user back to the accounts page
      router.push("/accounts");
    } else if (error.cause === errorCausesObj.noGoalWeightEntry) {
      // If no goal weight entry is found, navigate to entry page 
      const navigationURL = "/entry?type=goal-weight-entry";
      router.push(navigationURL);
    } else if (error.cause === errorCausesObj.noUserEntry) {
      // Redirects the user back to the home page if no entry is found
      router.push("/");
    } else {
      // Reloads the main page
      window.location.reload();
    }
  }

  /**
   * Starts a count down on page load
   */
  useEffect(() => {
    if (timeCount <= 0) {
      // Checks if debug mode is enabled 
      if (debug) {
        // Only logs a message if debug mode is enabled
        console.log("Navigation Triggered")
        return;
      } else {
        // Calls the function to handle navigation
        navigateToPage();
        return;
      }
    }

    const timeOutCounter = setInterval(() => {
      setTimeCount((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timeOutCounter);
    };
  }, [timeCount]);

  if (error.cause === errorCausesObj.noGoalWeightEntry) {
    return (
      <div className="w-full h-full flex flex-col justify-around items-center">
        <h2 className="text-4xl md:text-6xl text-center">
          Welcome! First step is to enter a goal weight.
        </h2>

        <p className="text-2xl md:text-3xl text-center">
          <span className="text-info">{error.message}</span>
          <br />
          Navigating to goal weight entry page in {timeCount}...
        </p>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full flex flex-col justify-around items-center">
        <h2 className="text-4xl md:text-6xl text-center">
          An Error Has Occurred
        </h2>

        <p className="text-2xl md:text-3xl text-center">
          <span className="text-warning">{error.message}</span>
          <br />
          Navigating in {timeCount}...
        </p>
      </div>
    );
  }
}
