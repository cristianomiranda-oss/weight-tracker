"use client"
import Image from "next/image";
import Card from "./components/card";
import Header from "./components/header";
import Footer from "./components/footer";
import type { WeightEntryType } from "./libs/types";
import WeightEntry from "./components/weight-entry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faCirclePlus, faWeightScale } from "@fortawesome/free-solid-svg-icons";
import IconLink from "./components/icon-link";


export default function WeightLogHome() {
  const tempWeightArr: WeightEntryType[] = [
    {userId: 0, weightDate: new Date(), weightValue: 143.01, WeightEntryId: 0},
    {userId: 0, weightDate: new Date(), weightValue: 141.01, WeightEntryId: 1},
    {userId: 0, weightDate: new Date(), weightValue: 142.01, WeightEntryId: 2},
    {userId: 0, weightDate: new Date(), weightValue: 145.01, WeightEntryId: 3}
  ];

  function removeWeightEntry(entryId: number, userId: number) {
    console.log("TODO: Add entry removal");
  }

  return (
    <main className="w-full h-full">
      <Header>
        <IconLink className="hidden lg:block" icon={faArrowRightFromBracket} href="/"/>
      </Header>
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card className="p-0">
          <div className="w-full h-full flex flex-col bg-dusty-taupe-500 overflow-y-scroll scrollbar-track-dusty-taupe-700 scrollbar-thumb-turf-green-600">
            <div className="w-full h-10 sticky top-0 flex justify-around items-center border-b-2 text-3xl bg-dusty-taupe-700">
              <h2 className="w-1/3 text-center">Date</h2>
              <h2 className="w-1/3 text-center">Weight</h2>
              <h2 className="w-1/3 text-center">X</h2>
            </div>

            {tempWeightArr.map(entry => <WeightEntry key={entry.WeightEntryId} weightEntryObj={entry} removeEntry={() => removeWeightEntry(entry.WeightEntryId, entry.userId)} />)}
          </div>
        </Card>
      </div>
      <Footer className="flex justify-center items-center">
        <IconLink className="w-1/3 text-center" icon={faWeightScale} href="/entry"/>
        <IconLink className="w-1/3 text-center" icon={faCirclePlus} href="/entry"/>
        <IconLink className="w-1/3 text-center block lg:hidden" icon={faArrowRightFromBracket} href="/"/>
      </Footer>
    </main>
  );
}
