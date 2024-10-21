import {
  getUserMySubscriptions,
  postUserSubscribe,
  postUserUnsubscribe
} from '@/api/user';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

import React from 'react';

import { Query } from './Query';
import { ButtonProps, buttonVariants } from './ui/button';

export const SubscribeButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    authorId: string;
  }
>(({ className, variant, size, asChild = false, authorId, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  const { mutate: subscribe, isPending: isSubscribing } =
    postUserSubscribe.useMutation();
  const { mutate: unsubscribe, isPending: isUnsubscribing } =
    postUserUnsubscribe.useMutation();
  return (
    <Query query={getUserMySubscriptions.query()}>
      {({ data: { subscriptions } }) => {
        const isSubscribed = subscriptions.some(
          (subscription) => subscription.id === authorId
        );
        return (
          <Comp
            {...props}
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            onClick={() => {
              if (isSubscribed) {
                unsubscribe({ authorId });
              } else {
                subscribe({ authorId });
              }
            }}
            disabled={props.disabled || isSubscribing || isUnsubscribing}
          >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </Comp>
        );
      }}
    </Query>
  );
});
SubscribeButton.displayName = 'SubscribeButton';
