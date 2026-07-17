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
import WeightLogTableTable from "../components/weight-log-table";

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

  async function deleteWeightEntry(entryId: number, userId: number) {
    // Sets the loading boolean and clears the error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      await removeWeightEntry(entryId, userId);
    } catch (error) {
      // Checks if error is a known error
      if (error instanceof Error && error.cause) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error has occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

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
          <WeightLogTableTable weightEntries={weightEntries} deleteWeightEntry={deleteWeightEntry} />
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
