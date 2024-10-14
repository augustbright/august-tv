import { SignInButton } from '@/components/sign-in-button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export const AppUploadUnauthenticated = () => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Sign in to upload videos</DialogTitle>
        <DialogDescription>
          You need to sign in to upload videos to your account.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <SignInButton
          size='lg'
          variant='default'
        />
      </DialogFooter>
    </>
  );
};
