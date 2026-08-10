import Card from "@/app/components/card";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";

interface ErrorDisplayProps {
  error: Error;
  router: AppRouterInstance
}

/**
 * Displays the error and handles the timing before redirecting user to the appropriate page
 */
export default function ErrorDisplay({
  error,
  router
}: ErrorDisplayProps) {
  const [timeCount, setTimeCount] = useState<number>(15);


  /**
   * Starts a count down on page load
   */
  useEffect(() => {
    const timeOutCounter = setInterval(() => {
      if (timeCount > 0) {
        // Decrements the timeout counter
        setTimeCount((prevValue) => prevValue - 1);
      } else {

        // Redirects the user to the appropriate page
        router.push('/');
      }
    }, 1000);

    return () => {
      clearInterval(timeOutCounter);
    };
  }, []);

  return (
    <Card>
      <h2>An Error Has Occurred</h2>

      {typeof error.cause === "string" && <h3>{error.cause}</h3>}

      <p>{error.message}</p>

      <h2>{timeCount}</h2>
    </Card>
  );
}
