import WeightLogDisplay from "./containers/weight-log-display";

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
