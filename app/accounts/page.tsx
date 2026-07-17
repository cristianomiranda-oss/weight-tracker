import Card from "../components/card";
import Footer from "../components/footer";
import Header from "../components/header";
import AccountForm from "./components/account-form";

export default function AccountsPage() {
  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card>
            <AccountForm />
        </Card>
      </div>
      <Footer />
    </main>
  );
}
