import { getQueryClient } from '@/api/queryClient';
import { postUserSessionLogin } from '@/api/user';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { UserCredential, signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../firebase';

export const mutateSignInWithEmailAndPassword = (): UseMutationOptions<
  UserCredential,
  Error,
  {
    email: string;
    password: string;
  }
> => ({
  mutationFn: async ({ email, password }) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    await postUserSessionLogin.mutate({ idToken });

    getQueryClient().invalidateQueries({
      queryKey: ['user', 'current']
    });
    return userCredential;
  }
});

export const useMutateSignInWithEmailAndPassword = () =>
  useMutation(mutateSignInWithEmailAndPassword());
