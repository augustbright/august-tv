import { useMutateSignInWithGoogle } from "@/mutations/signInWithGoogle";
import { useMutateSignOut } from "@/mutations/signOut";
import { useQueryCurrentUser } from "@/queries/currentUser";
import { useEffect } from "react";
import { ws } from "../websocket";

export const useUser = () => {
    const { data: current } = useQueryCurrentUser();
    const initials = current?.data.nickname
        .split(" ")
        .map((name: string) => name[0])
        .join("");

    const signIn = {
        google: useMutateSignInWithGoogle(),
    };

    useEffect(() => {
        if (current && !ws.isConnected) {
            ws.connect();
        }
        if (!current && ws.isConnected) {
            ws.disconnect();
        }
    }, [current]);

    const signOut = useMutateSignOut();

    return {
        current,
        initials,
        signIn,
        signOut,
    };
};
