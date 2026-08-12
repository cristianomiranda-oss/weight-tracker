import { useState } from "react"

interface ApiDebugProps {

}

/**
 * Launches various fetch calls to the api endpoints and reports their results
 */
export default function ApiDebug({}: ApiDebugProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState();

    return (
        <>

        </>
    )
}