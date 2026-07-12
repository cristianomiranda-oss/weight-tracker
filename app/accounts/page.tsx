import Button from "../components/button";
import Card from "../components/card";
import Footer from "../components/footer";
import Header from "../components/header";
import LabeledInput from "../components/labeled-input";

export default function AccountsPage() {
  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card>
            <h2 className="text-5xl">Sign In</h2>
            <LabeledInput id="userName" label="Username" inputType="text" />
            <LabeledInput id="passWord" label="Password" inputType="password" />

            <Button>Login</Button>

            <p>New User? <span className="text-blue-600 cursor-pointer select-none">Create New Account</span></p>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
