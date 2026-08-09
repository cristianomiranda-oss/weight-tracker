import { errorCausesObj } from "./errors";

/**
   * Contains the logic for filtering all variable values before passing them to the MongoDB CRUD methods
   */
export class FilterTests {
  // Validates the standard uuid format
  static uuidFilter = /(^[\w\d]{8}(-[\w\d]{4}){3}-[\w\d]{12}$)/;

  // Filters match from start of the line to end and require all characters  to be within their defined filter
  static userNameFilter = /(^[-\w]+$)/;
  static passWordFilter = /(^[-\w+?!@#$%^&*]+$)/;

  // Filters weight value, allows for whole numbers only or up to the hundredths decimal position
  static weightValueFilter = /(^[\d]+(\.[\d]{1,2})?$)/;

  // Filters the date value, requires only the hour and minutes for the time portion
  static dateFilter = /(^[\d]{4}(-[\d]{2}){2}T[\d]{2}:[\d]{2}$)/;

  /**
   * Checks if the passed in username is valid
   * Valid characters include all letters, digits, and either '_-' character.
   * @param {string} userName The username to be tested
   * @throws Throws if username is invalid
   */
  static validateUserName(userName: string) {
    // checks if username is blank
    if (userName === "") {
      throw new Error("Username cannot be blank", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    // Checks if username is greater than 6 and less than 25 characters
    if (userName.length < 6) {
      throw new Error("Username cannot be less than 6 characters", {
        cause: errorCausesObj.invalidParameterValue,
      });
    } else if (userName.length > 25) {
      throw new Error("Username cannot exceed 25 characters", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    // Checks if the userName contain only valid characters
    if (!this.userNameFilter.test(userName)) {
      throw new Error(
        "Username can only contain letter, digits, '_', and '-'",
        {
          cause: errorCausesObj.invalidParameterValue,
        },
      );
    }
  }

  /**
   * Checks if the passed in password is valid
   * Valid characters include all letters, digits, and any '_-?!@#$%^&*' character,
   * @param {string} passWord The password to be tested
   * @throws Throws if password is invalid
   */
  static validatePassword(passWord: string) {
    // checks if username is blank
    if (passWord === "") {
      throw new Error("Password cannot be blank", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    // Checks if username is greater than 8 and less than 30 characters
    if (passWord.length < 8) {
      throw new Error("Password cannot be less than 8 characters", {
        cause: errorCausesObj.invalidParameterValue,
      });
    } else if (passWord.length > 30) {
      throw new Error("Password cannot exceed 30 characters", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    // Checks if the password contain only valid characters
    if (!this.passWordFilter.test(passWord)) {
      throw new Error(
        "Password can only contain letter, digits, or any '_-?!@#$%^&*' special character",
        {
          cause: errorCausesObj.invalidParameterValue,
        },
      );
    }
  }

  /**
   * Checks if the passed in id value is valid
   * Valid characters include all letters, digit, and '-' in the pattern of "########-####-####-####-############" (# representing any letter or digit).
   * @param {string} uuid The id to be tested
   * @throws Throws if uuid is invalid
   */
  static validateUUID(uuid: string) {
    if (uuid.length !== 36) {
      throw new Error("Invalid entry Id", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (!this.uuidFilter.test(uuid)) {
      throw new Error("Invalid entry Id", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }
  }

  /**
   * Checks if the passed in weight value is valid
   * Valid pattern being any whole number or number with decimal to the hundredths place.
   * Example: "###", "###.#", or "###.##"
   * @param {string} weightValue The weight value to be tested
   * @throws Throws if weightValue is invalid
   */
  static validateWeightValue(weightValue: number) {
    if (weightValue < 0 || Number.isNaN(weightValue)) {
      throw new Error("Weight value cannot be less than zero", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (!this.weightValueFilter.test(weightValue.toString())) {
      throw new Error("Invalid weight value", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }
  }

  /**
   * Checks if the passed in goal type is valid
   * Valid strings are "Loss", "Gain", "Maintenance"
   * @param {string} goalType The goalType string to be tested
   * @throws Throws if goalType is invalid
   */
  static validateGoalType(goalType: string) {
    let isValid = false;

    for (const approvedType of ["Loss", "Gain", "Maintenance"]) {
      if (approvedType === goalType) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new Error("Invalid goal type", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }
  }

  /**
   * Checks if the passed in date string is valid
   * Valid string pattern is "YYYY-MM-DDT##:##"
   * @param {string} weighInDate The date string to be tested
   * @throws Throws if date is invalid
   */
  static validateDateValue(weighInDate: string) {
    // Checks if the passed in date string is empty
    if (weighInDate === "") {
      throw new Error("Weigh in date cannot be blank", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (!this.dateFilter.test(weighInDate)) {
      throw new Error("Invalid weigh in date", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }
  }
}
