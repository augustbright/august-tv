import { cn } from '@/lib/utils';
import { useMutateSubscribe } from '@/mutations/subscribe';
import { useMutateUnsubscribe } from '@/mutations/unsubscribe';
import { queryMySubscriptions } from '@/queries/mySubscriptions';
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
  const { mutate: subscribe, isPending: isSubscribing } = useMutateSubscribe();
  const { mutate: unsubscribe, isPending: isUnsubscribing } =
    useMutateUnsubscribe();
  return (
    <Query query={queryMySubscriptions()}>
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
                unsubscribe(authorId);
              } else {
                subscribe(authorId);
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
