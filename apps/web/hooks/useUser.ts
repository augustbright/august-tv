import { useMutateSignInWithGoogle } from "@/mutations/signInWithGoogle";
import { useMutateSignOut } from "@/mutations/signOut";
import { useQueryCurrentUser } from "@/queries/currentUser";
import { useEffect } from "react";
import { ws } from "../websocket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TMessage } from "@august-tv/common/types";
import { toast } from "react-toastify";
import { KEY } from "@/queries/keys";
import { API, getApiClient } from "@/api";
import { atom, useAtom } from "jotai";
import { Job } from "@prisma/client";
import { TUserEndpointResult } from "@august-tv/dto";

const jobsAtom = atom<Job[]>([]);

export const useUser = () => {
    const { data: current } = useQueryCurrentUser();
    const queryClient = useQueryClient();
    const [rawJobs, setJobs] = useAtom(jobsAtom);
    const { refetch: refetchMyJobs } = useQuery({
        queryKey: KEY.MY_JOBS,
        queryFn: async () => {
            const apiClient = await getApiClient();
            const { data } = await apiClient.get<
                TUserEndpointResult<"getMyJobs">
            >(API.myJobs());
            setJobs(data);
            return data;
        },
    });

    const jobs = rawJobs.toSorted((a, b) => {
        if (a.createdAt > b.createdAt) {
            return -1;
        }
        if (a.createdAt < b.createdAt) {
            return 1;
        }
        return 0;
    });

    const activeJobs = (jobs ?? []).filter(
        (job) => job.status === "IN_PROGRESS"
    );
    const signIn = {
        showModal: () => {},
        google: useMutateSignInWithGoogle(),
    };

    useEffect(() => {
        if (current) {
            refetchMyJobs();
        } else {
            setJobs([]);
        }
        if (current && !ws.isConnected) {
            const client = ws.connect();
            if (client) {
                client.on("message", (data) => {
                    if (typeof data === "string") {
                        let message: TMessage;
                        try {
                            message = JSON.parse(data);
                        } catch (error) {
                            console.error(
                                `Failed to parse message: ${String(error)}`
                            );
                            return;
                        }

                        switch (message.type) {
                            case "dummy-notification":
                                toast(message.message);
                                break;
                            case "job-status":
                                if (message.action === "created") {
                                    setJobs((prev) => [...prev, message.job]);
                                } else {
                                    setJobs((prev) =>
                                        prev.map((job) =>
                                            job.id === message.job.id
                                                ? message.job
                                                : job
                                        )
                                    );
                                }
                                break;
                        }
                    }
                });
            }
        }
        if (!current && ws.isConnected) {
            ws.disconnect();
        }
    }, [current, queryClient]);

    const signOut = useMutateSignOut();

    return {
        current,
        jobs: jobs || [],
        activeJobs,
        signIn,
        signOut,
    };
};
