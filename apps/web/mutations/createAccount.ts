import { getQueryClient } from '@/api/queryClient';
import { postUserSessionLogin } from '@/api/user';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import {
  UserCredential,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';

import { auth } from '../firebase';

export const mutateCreateAccount = (): UseMutationOptions<
  UserCredential,
  Error,
  {
    email: string;
    password: string;
  }
> => ({
  mutationFn: async ({ email, password }) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    await postUserSessionLogin.mutate({ idToken });

    await sendEmailVerification(userCredential.user);

    getQueryClient().invalidateQueries({
      queryKey: ['user', 'current']
    });
    return userCredential;
  }
});

export const useMutateCreateAccount = () => useMutation(mutateCreateAccount());
