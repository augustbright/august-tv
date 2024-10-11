import { useMutateSignInWithGoogle } from "@/mutations/signInWithGoogle";
import { useMutateSignOut } from "@/mutations/signOut";
import { useQueryCurrentUser } from "@/queries/currentUser";
import { useEffect } from "react";
import { ws } from "../websocket";

export const useUser = () => {
    const { data: current } = useQueryCurrentUser();

    const signIn = {
        showModal: () => {},
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
        signIn,
        signOut,
    };
};
