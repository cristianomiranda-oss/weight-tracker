"use client";
import {
  faArrowRightFromBracket,
  faCirclePlus,
  faWeightScale,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/header";
import IconLink from "../components/icon-link";
import Card from "../components/card";
import Footer from "../components/footer";
import type { WeightEntryType } from "../libs/types";
import WeightEntry from "../components/weight-entry";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface WeightLogDisplayProps {
  removeWeightEntry: (entryId: number, userId: number) => Promise<void>;
  getWeightEntries: () => Promise<WeightEntryType[]>;
}

export default function WeightLogDisplay({
  getWeightEntries,
  removeWeightEntry,
}: WeightLogDisplayProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [weightEntries, setWeightEntries] = useState<WeightEntryType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
      async function loadWeightEntries() {
        // Sets the loading boolean and clears the error message 
        setIsLoading(true);
        setErrorMessage("");

        try {
          const userWeightEntries = await getWeightEntries();
          setWeightEntries(userWeightEntries);
        } catch (error) {
          // Checks if error is a known error
          if (error instanceof Error && error.cause) {
            // Checks the cause of the error
            if (error.cause === "invalid-user-cookie") {
              router.push("/accounts");
            } else {
              setErrorMessage(error.message);
            }
          } else {
            setErrorMessage("An unknown error has occurred");
          }
        } finally {
            setIsLoading(false);
        }
      }

      loadWeightEntries();
  }, []);


  return (
    <>
      <Header>
        <IconLink
          className="hidden lg:block"
          icon={faArrowRightFromBracket}
          href="/accounts"
          disabled={isLoading}
        />
      </Header>
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card className="p-0">
          <div className="w-full h-full flex flex-col bg-dusty-taupe-500 overflow-y-scroll scrollbar-track-dusty-taupe-700 scrollbar-thumb-turf-green-600">
            <div className="w-full h-10 md:h-12 sticky top-0 flex justify-center items-center border-b-2 text-3xl md:text-4xl bg-dusty-taupe-700">
              <h2 className="w-5/12 text-center">Date</h2>
              <h2 className="w-5/12 text-center">Weight</h2>
              <h2 className="w-2/12 text-center">X</h2>
            </div>

            {weightEntries.map((entry) => (
              <WeightEntry
                key={entry.WeightEntryId}
                weightEntryObj={entry}
                removeEntry={() =>
                  removeWeightEntry(entry.WeightEntryId, entry.userId)
                }
              />
            ))}
          </div>
        </Card>
      </div>
      <Footer className="flex justify-around lg:justify-center gap-0 lg:gap-36 items-center">
        <IconLink
          className="text-center"
          icon={faWeightScale}
          href="/entry"
          disabled={isLoading}
        />
        <IconLink
          className="text-center"
          icon={faCirclePlus}
          href="/entry"
          disabled={isLoading}
        />
        <IconLink
          className="text-center block lg:hidden"
          icon={faArrowRightFromBracket}
          href="/accounts"
          disabled={isLoading}
        />
      </Footer>
    </>
  );
}
