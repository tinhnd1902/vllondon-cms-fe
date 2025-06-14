import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Ipremium Payment Dashboard",
  description: "Login | Ipremium Payment Dashboard",
};

export default function Login() {
  return <LoginForm />;
}
