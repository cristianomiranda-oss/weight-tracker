"use client"
import { useState } from "react";
import Button from "../components/button";
import Card from "../components/card";
import Footer from "../components/footer";
import Header from "../components/header";
import LabeledInput from "../components/labeled-input";
import { useRouter } from "next/navigation";

export default function AccountsPage() {
  const router = useRouter();
  const [isAccountCreationEnabled, setIsAccountCreationEnabled] = useState<boolean>(false);
  const toggleAccountCreation = () => setIsAccountCreationEnabled(curr => !curr);

  function navigateToHome() {
    router.push('/');
  }

  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card>
            <h2 className="text-5xl">{isAccountCreationEnabled ? "Create Account" : "Sign In"}</h2>
            
            <LabeledInput id="userName" label="Username" inputType="text" />
            <LabeledInput id="passWord" label="Password" inputType="password" />
            {isAccountCreationEnabled && <LabeledInput id="passWord" label="Confirm Password" inputType="password" />}

            {!isAccountCreationEnabled && <>
              <Button onClick={navigateToHome}>Login</Button>
              <p>New User? <span className="text-blue-600 cursor-pointer select-none" onClick={toggleAccountCreation}>Create New Account</span></p>
            </>}

            {isAccountCreationEnabled && <>
              <Button>Create Account</Button>
              <Button type="warning" onClick={toggleAccountCreation}>Cancel</Button>
            </>}
        </Card>
      </div>
      <Footer />
    </main>
  );
}
