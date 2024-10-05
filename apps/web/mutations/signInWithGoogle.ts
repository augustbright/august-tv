import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../firebase';
import { API, getApiClient } from '../api';
import { getQueryClient } from '@/queries/queryClient';
import { KEY } from '@/queries/keys';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const mutateSignInWithGoogle =
  (): UseMutationOptions<UserCredential> => ({
    mutationFn: async () => {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();
      const apiClient = await getApiClient();
      await apiClient.post(API.sessionLogin(), { idToken });

      getQueryClient().invalidateQueries({
        queryKey: KEY.CURRENT_USER,
      });
      return userCredential;
    },
  });

export const useMutateSignInWithGoogle = () =>
  useMutation(mutateSignInWithGoogle());
