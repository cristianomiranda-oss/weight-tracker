/**
 * Object containing various error causes for the project
 */
export const errorCausesObj = {
  invalidUserCookie: "invalid-user-cookie",
  invalidParameterValue: "invalid-parameter-value",
  invalidComparison: "invalid-comparison",
  processFail: "process-fail",
  unknownError: "unknown-error",
};

/**
 * Checks the type of error thrown. Common errors are returned and 
 * errors relating to issues with the main process or with unknown
 * causes are logged to the console
 * 
 * @param error the error object being evaluated
 */
export function handleMiddleWareErrors(error: unknown): Error {
  if (error instanceof Error && error.cause) {
    // Checks if the error is due to a problematic cause
    if (error.cause === errorCausesObj.processFail) {
      // Displays the error before returning it if it is a failure with the main process
      console.error(error);
      return error;
    } else {
      return error;
    }
  } else {
    // Displays the unexpected error before throwing a new error indicating an unknown issue occurred
    console.error(error);
    
    // Creates a new error to return
    const newError = new Error(
      "An Unknown error has occurred in the account creation process",
      {
        cause: errorCausesObj.unknownError,
      },
    );
    return newError;
  }

}
