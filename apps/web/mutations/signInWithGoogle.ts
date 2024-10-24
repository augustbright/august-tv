import { getQueryClient } from '@/api/queryClient';
import { postUserSessionLogin } from '@/api/user';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import {
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup
} from 'firebase/auth';

import { auth } from '../firebase';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const mutateSignInWithGoogle =
  (): UseMutationOptions<UserCredential> => ({
    mutationFn: async () => {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();

      await postUserSessionLogin.mutate({ idToken });

      getQueryClient().invalidateQueries({
        queryKey: ['user', 'current']
      });
      return userCredential;
    }
  });

export const useMutateSignInWithGoogle = () =>
  useMutation(mutateSignInWithGoogle());
