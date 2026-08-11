import Card from "@/app/components/card";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";
import { errorCausesObj } from "../utils/errors";

interface ErrorDisplayProps {
  error: Error;
  router: AppRouterInstance;
}

/**
 * Displays the error and handles the timing before redirecting user to the appropriate page
 */
export default function ErrorDisplay({ error, router }: ErrorDisplayProps) {
  const [timeCount, setTimeCount] = useState<number>(15);

  function navigateToPage() {
    if (
      error.cause === errorCausesObj.invalidUserCookie ||
      error.cause === errorCausesObj.accessDenied
    ) {
      // Redirects the user back to the accounts page
      router.push("/");
    } else if (error.cause === errorCausesObj.noGoalWeightEntry) {
      const navigationURL = "/entry?type=goal-weight-entry";
      router.push(navigationURL);
    } else {
      router.refresh();
    }
  }

  /**
   * Starts a count down on page load
   */
  useEffect(() => {
    const timeOutCounter = setInterval(() => {
      if (timeCount > 0) {
        // Decrements the timeout counter
        setTimeCount((prevValue) => prevValue - 1);
      } else {
        navigateToPage();
      }
    }, 1000);

    return () => {
      clearInterval(timeOutCounter);
    };
  }, []);

  if (error.cause === errorCausesObj.noGoalWeightEntry) {
    return (
      <Card>
        <h2>Welcome! First step is to enter a goal weight.</h2>

        <p>navigating to goal weight entry page in ... </p>

        <h2>{timeCount}</h2>
      </Card>
    );
  } else {
    return (
      <Card>
        <h2>An Error Has Occurred</h2>

        {typeof error.cause === "string" && <h3>{error.cause}</h3>}

        <p>{error.message}</p>

        <h2>{timeCount}</h2>
      </Card>
    );
  }
}
