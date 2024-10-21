import { getUserCurrent, getUserMyJobs, postUserSignOut } from '@/api/user';
import { useMutateSignInWithGoogle } from '@/mutations/signInWithGoogle';
import { TMessage } from '@august-tv/common/types';
import { Job } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { ws } from '../websocket';

const jobsAtom = atom<Job[]>([]);

export const useUser = () => {
  const { data: current } = getUserCurrent.useQuery();
  const queryClient = useQueryClient();
  const [rawJobs, setJobs] = useAtom(jobsAtom);
  const { refetch: refetchMyJobs } = useQuery({
    queryKey: ['user', 'myJobs'],
    queryFn: async () => {
      const data = await getUserMyJobs.get();
      setJobs(data);
      return data;
    }
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
    (job) => job.status === 'IN_PROGRESS' || job.status === 'FAILED'
  );
  const signIn = {
    showModal: () => {},
    google: useMutateSignInWithGoogle()
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
        client.on('message', (data) => {
          if (typeof data === 'string') {
            let message: TMessage;
            try {
              message = JSON.parse(data);
            } catch (error) {
              console.error(`Failed to parse message: ${String(error)}`);
              return;
            }

            switch (message.type) {
              case 'dummy-notification':
                toast(message.message);
                break;
              case 'job-status':
                if (message.action === 'created') {
                  setJobs((prev) => [...prev, message.job]);
                } else {
                  setJobs((prev) =>
                    prev.map((job) =>
                      job.id === message.job.id ? message.job : job
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
  }, [current, queryClient, refetchMyJobs, setJobs]);

  const signOut = postUserSignOut.useMutation();

  return {
    current,
    jobs: jobs || [],
    activeJobs,
    signIn,
    signOut
  };
};
