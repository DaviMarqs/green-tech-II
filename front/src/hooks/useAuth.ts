import { AuthContext } from "@/contexts/AuthContest";
import { useContext } from "react";


export default function useAuth() {
    return useContext(AuthContext);
}