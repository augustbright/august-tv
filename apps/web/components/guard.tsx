'use client';

import { getUserCurrent } from '@/api/user';
import { TUserEndpointResult } from '@august-tv/generated-types';

import { useRouter } from 'next/navigation';

import { Query, TQueryChildrenProps } from './Query';

export const RedirectHome = () => {
  const router = useRouter();
  router.replace('/');
  return null;
};

export const Guard = ({
  children,
  fallback,
  roles,
  fallbackNoPermission,
  loading = Query.LOADING.NONE,
  ...queryProps
}: {
  children:
    | React.ReactNode
    | ((
        currentUser: NonNullable<TUserEndpointResult<'getCurrentUser'>>
      ) => React.ReactNode);
  fallback: React.ReactNode;
  fallbackNoPermission?: React.ReactNode;
  roles?: string[];
} & TQueryChildrenProps<TUserEndpointResult<'getCurrentUser'>>) => {
  return (
    <Query
      query={getUserCurrent.query()}
      loading={loading}
      {...queryProps}
    >
      {({ data: currentUser }) => {
        if (!currentUser?.data) {
          return <>{fallback}</>;
        }
        if (roles?.length) {
          if (!currentUser.roles.some((role) => roles.includes(role.name))) {
            return fallbackNoPermission || fallback;
          }
        }
        return typeof children === 'function'
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            children(currentUser as any)
          : children;
      }}
    </Query>
  );
};

Guard.RedirectHome = RedirectHome;
