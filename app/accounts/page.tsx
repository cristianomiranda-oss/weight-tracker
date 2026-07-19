import Card from "../components/card";
import Footer from "../components/footer";
import Header from "../components/header";
import { createUserCookie } from "../libs/cookies";
import AccountForm from "./components/account-form";

/**
 * Contains the logic and comments for the accounts page
 */
export default function AccountsPage(): React.JSX.Element {
  /**
   * Middleware for accessing the database to create a new user account
   * @param userName Username for the account to be created - Must be within 6 - 25 characters
   * @param userPassword Password for the account to be created - Must be within 8 - 30 characters
   * @param confirmPassWord Retying of the password for the account to be created - Must match the userPassword
   * @throws Signals the process failed
   */
  async function createUserAccount(
    userName: string,
    userPassword: string,
    confirmPassWord: string,
  ): Promise<void> {
    "use server";
    if (userName === "" || userPassword === "") {
      throw new Error("Username and Password cannot be blank");
    }

    if (userName.length < 6) {
      throw new Error("Username cannot be less than 6 characters");
    } else if (userName.length > 25) {
      throw new Error("Username cannot exceed 25 characters");
    }

    if (userPassword.length < 8) {
      throw new Error("Password cannot be less than 8 characters");
    } else if (userPassword.length > 30) {
      throw new Error("Password cannot exceed 30 characters");
    }

    if (userPassword !== confirmPassWord) {
      throw new Error("Passwords do no match");
    }

    // TODO: Add database method
    // const isAccountCreated = createUserAccount();
    const isAccountCreated = true;

    if (isAccountCreated) {
      return;
    } else {
      throw new Error("Account Creation failed");
    }
  }

  /**
   * Middleware for validating the user's provided credentials with the values stored in the database.
   * @param userName - Username for the account that will be accessed
   * @param userPassword - Password for comparing against the one associated with the account that will be accessed
   * @throws Signals the process failed
   */
  async function validateLogin(
    userName: string,
    userPassword: string,
  ): Promise<void> {
    //Marks the function as a server function
    "use server";
    if (userName === "" || userPassword === "") {
      throw new Error("Username and Password cannot be blank");
    }

    if (userName.length < 6 || userName.length > 25) {
      throw new Error("Username is invalid");
    }

    if (userPassword.length < 8 || userPassword.length > 30) {
      throw new Error("Password is invalid");
    }

    // TODO: Add database method
    // const userId = validateUserAccount();
    const userId = 1;

    if (userId === null) {
      throw new Error("Account Login Failed");
    }

    const isCookieStored = await createUserCookie(userId);

    if (isCookieStored) {
      return;
    } else {
      throw new Error("Failed to Login");
    }
  }

  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card>
          <AccountForm
            createUserAccount={createUserAccount}
            validateLogin={validateLogin}
          />
        </Card>
      </div>
      <Footer />
    </main>
  );
}
