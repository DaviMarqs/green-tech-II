import { AuthContext } from "@/contexts/AuthContest";
import { useContext } from "react";

export function AuthGuard() {
    const { signedIn } = useContext(AuthContext);
}