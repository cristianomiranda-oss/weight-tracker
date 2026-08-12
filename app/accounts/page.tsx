import Card from "../components/card";
import ErrorDisplay from "../components/error-display";
import Footer from "../components/footer";
import Header from "../components/header";
import { getUnknownError } from "../utils/errors";
import AccountForm from "./components/account-form";

/**
 * Contains the logic and comments for the accounts page
 */
export default function AccountsPage(): React.JSX.Element {
  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] min-h-min p-8">
        <Card>
          <AccountForm />
        </Card>
      </div>
      <Footer />
    </main>
  );
}
