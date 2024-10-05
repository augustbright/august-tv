'use client';

import { useUser } from '@/hooks/useUser';
import { redirect } from 'next/navigation';

export const Guard = ({ children }: { children: React.ReactNode }) => {
  const { current } = useUser();
  if (!current) {
    redirect('/');
  }
  return <>{children}</>;
};
