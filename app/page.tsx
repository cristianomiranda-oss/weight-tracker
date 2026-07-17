import Card from "./components/card";
import Header from "./components/header";
import Footer from "./components/footer";
import type { WeightEntryType } from "./libs/types";
import WeightEntry from "./components/weight-entry";
import { faArrowRightFromBracket, faCirclePlus, faWeightScale } from "@fortawesome/free-solid-svg-icons";
import IconLink from "./components/icon-link";
import WeightLogDisplay from "./containers/weight-log-display";


export default function WeightLogHome() { 
  async function removeWeightEntry(entryId: number, userId: number) {
    "use server"
    console.log("TODO: Add entry removal");
  }

  return (
    <main className="w-full h-full">
      <WeightLogDisplay removeWeightEntry={removeWeightEntry} />
    </main>
  );
}
