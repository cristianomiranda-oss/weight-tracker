import { ApiEndPointDebugTests } from "@/app/libs/types";

interface TestIndicatorDisplayProps {
  testIndicators: ApiEndPointDebugTests;
}

/**
 * Displays a list of the various test endpoints and their results
 */
export default function TestIndicatorDisplay({
  testIndicators,
}: TestIndicatorDisplayProps) {
  const testIndicatorsArr = Object.entries(testIndicators);

  const TestIndicators = testIndicatorsArr.map((entry) => {
    let message = entry[1];
    if (message === "") {
        message = "Test not performed"
    }

    return (
      <p key={entry[0]} className="text-xl md:text-2xl border-y px-0.5">
        <span className="text-yellow-600">{entry[0]}:</span>
        <br />
        {message}
      </p>
    );
  });

  return <>{TestIndicators}</>;
}
