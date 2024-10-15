import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import {
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup
} from 'firebase/auth';

import { api } from '../api';
import { auth } from '../firebase';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const mutateSignInWithGoogle =
  (): UseMutationOptions<UserCredential> => ({
    mutationFn: async () => {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();

      await api((r) => r.user.sessionLogin).post({ idToken });

      getQueryClient().invalidateQueries({
        queryKey: KEY.CURRENT_USER
      });
      return userCredential;
    }
  });

export const useMutateSignInWithGoogle = () =>
  useMutation(mutateSignInWithGoogle());
