"use client"
import Image from "next/image";
import Card from "./components/card";
import Header from "./components/header";
import Footer from "./components/footer";
import type { WeightEntryType } from "./libs/types";
import WeightEntry from "./components/weight-entry";


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
      <Header />
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card>
          <div className="w-full h-10 flex justify-around items-center border-b-2 text-3xl bg-dusty-taupe-700">
            <h2 className="w-1/3 text-center">Date</h2>
            <h2 className="w-1/3 text-center">Weight</h2>
            <h2 className="w-1/3 text-center">X</h2>
          </div>
          <div className="w-full h-[calc(100%-2.5rem)] flex flex-col bg-dusty-taupe-500 overflow-y-auto">
            {tempWeightArr.map(entry => <WeightEntry key={entry.WeightEntryId} weightEntryObj={entry} removeEntry={() => removeWeightEntry(entry.WeightEntryId, entry.userId)} />)}
          </div>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
