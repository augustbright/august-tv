import { useMutateCreateAccount } from '@/mutations/createAccount';
import { zodResolver } from '@hookform/resolvers/zod';

import { FirebaseError } from 'firebase/app';
import React from 'react';
import { useForm } from 'react-hook-form';
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
import { TSignInMachine } from './state-machine';

const signUpFormSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email({ message: 'Email is invalid' }),
    password: z.string().min(1, 'Password is required'),
    passwordConfirmation: z.string().min(1, 'Password confirmation is required')
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['passwordConfirmation']
      });
    }
  });

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export const DialogContentSignUp = ({
  machine
}: {
  machine: TSignInMachine;
}) => {
  const { mutateAsync: createAccount, isPending: isCreatingAccount } =
    useMutateCreateAccount();

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    disabled: isCreatingAccount,
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: ''
    }
  });

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      await createAccount(values);
      machine.dispatch({ type: 'setPage', page: 'account-created' });
    } catch (error) {
      console.dir(error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            signUpForm.setError('email', {
              type: 'manual',
              message: 'Email is already in use'
            });
            break;
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
        <DialogTitle>Create an account</DialogTitle>
        <DialogDescription>
          Enter your email and password below to create your account
        </DialogDescription>
      </DialogHeader>
      <Form {...signUpForm}>
        <form
          className='grid gap-4'
          onSubmit={signUpForm.handleSubmit(handleSubmit)}
        >
          <div className='grid gap-2'>
            <FormField
              control={signUpForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      placeholder='m@example.com'
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid gap-2'>
            <FormField
              control={signUpForm.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid gap-2'>
            <FormField
              control={signUpForm.control}
              name='passwordConfirmation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='passwordConfirmation'>
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type='submit'
            className='w-full'
          >
            Register
          </Button>
        </form>
      </Form>

      <div className='mt-4 text-center text-sm'>
        Already have an account?{' '}
        <Button
          variant='inline-link'
          onClick={() => machine.dispatch({ type: 'setPage', page: 'signIn' })}
        >
          Sign in
        </Button>
      </div>
    </>
  );
};
