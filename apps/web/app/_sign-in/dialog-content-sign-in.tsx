import { Loader } from '@/components/ui/loader';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/hooks/useUser';
import { useMutateSignInWithEmailAndPassword } from '@/mutations/signInWithPassword';
import { zodResolver } from '@hookform/resolvers/zod';

import { FirebaseError } from 'firebase/app';
import { LogIn } from 'lucide-react';
import React from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

import { toast } from '../../components/hooks/use-toast';
import { Button } from '../../components/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { useSignInDialog } from './sign-in-dialog';
import { TSignInMachine } from './state-machine';

const signInFormSchema = z.object({
  email: z.string().min(1, 'is required').email({ message: 'is invalid' }),
  password: z.string().min(1, 'is required')
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

export const DialogContentSignIn = ({
  machine
}: {
  machine: TSignInMachine;
}) => {
  const { signIn } = useUser();
  const { setOpen } = useSignInDialog();

  const {
    mutateAsync: signInWithEmailAndPassword,
    isPending: isSigningInWithEmailAndPassword
  } = useMutateSignInWithEmailAndPassword();

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    disabled: isSigningInWithEmailAndPassword,
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const rootError = useFormState(signInForm).errors.root?.message;

  const handleSubmit = async (values: SignInFormValues) => {
    try {
      await signInWithEmailAndPassword(values);
      setOpen(null);
    } catch (error) {
      console.dir(error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            signInForm.setError('email', {
              type: 'manual',
              message: 'not found'
            });
            return;
          case 'auth/user-disabled':
            signInForm.setError('root', {
              type: 'manual',
              message: 'User is disabled'
            });
            return;
          case 'auth/wrong-password':
            signInForm.setError('password', {
              type: 'manual',
              message: 'is incorrect'
            });
            return;
          case 'auth/invalid-credential':
            signInForm.setError('root', {
              type: 'manual',
              message: 'Wrong email or password'
            });
            return;
          case 'auth/too-many-requests':
            signInForm.setError('root', {
              type: 'manual',
              message: 'Too many requests. Try again later'
            });
            return;
          default:
            break;
        }
      }

      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sign in</DialogTitle>
        <DialogDescription>
          Enter your email below to login to your account
        </DialogDescription>
      </DialogHeader>
      <Form {...signInForm}>
        <form
          className='grid grid-cols-3 gap-4'
          onSubmit={signInForm.handleSubmit(handleSubmit)}
        >
          <div className='grid col-span-3 gap-2'>
            <FormField
              control={signInForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <FormMessage className='inline' />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      placeholder='m@example.com'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className='grid col-span-3 gap-2'>
            <FormField
              control={signInForm.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='flex justify-between items-center'>
                    <FormLabel htmlFor='password'>
                      Password <FormMessage className='inline' />
                    </FormLabel>
                    <Button
                      type='button'
                      variant='inline-link'
                      onClick={() =>
                        machine.dispatch({
                          type: 'setPage',
                          page: 'forgotPassword'
                        })
                      }
                    >
                      {/* TODO: password restore */}
                      Forgot your password?
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {rootError && (
            <p className='col-span-3 flex justify-center text-sm text-destructive'>
              {rootError}
            </p>
          )}

          {isSigningInWithEmailAndPassword ? (
            <div className='col-span-3 flex items-center justify-center mt-8 h-10'>
              <Loader />
            </div>
          ) : (
            <Button
              className='col-start-2 col-end-3 mt-8'
              type='submit'
              disabled={isSigningInWithEmailAndPassword}
            >
              <LogIn className='w-4 h-4 mr-2' />
              Sign In
            </Button>
          )}

          <div className='col-span-3 text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Button
              variant='inline-link'
              onClick={() =>
                machine.dispatch({ type: 'setPage', page: 'signUp' })
              }
            >
              Sign up
            </Button>
          </div>
        </form>
      </Form>

      <Separator className='mt-8 mb-4 flex justify-center items-center'>
        <span className='text-sm text-gray-500 uppercase bg-background px-4'>
          or continue with
        </span>
      </Separator>

      <div className='flex justify-center'>
        <Button
          variant='outline'
          onClick={async () => {
            await signIn.google.mutate();
            setOpen(null);
          }}
        >
          Google
        </Button>
      </div>
    </>
  );
};
