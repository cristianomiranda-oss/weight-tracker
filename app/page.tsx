import type { GoalWeightEntryType, WeightEntryType } from "./libs/types";
import WeightLogDisplay from "./containers/weight-log-display";
import { getUserCookie } from "./libs/cookies";

/**
 * Contains the components and logic for the main page of the application
 */
export default function WeightLogHome(): React.JSX.Element {

  return (
    <main className="w-full h-full">
      <WeightLogDisplay />
    </main>
  );
}
