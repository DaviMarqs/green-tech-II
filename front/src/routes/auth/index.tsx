import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export function AuthGuard() {
  const { signedIn } = useContext(AuthContext);
}
