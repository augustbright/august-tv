'use client';

import { useUser } from '@/hooks/useUser';

export const ProfileHeader = () => {
  const { current } = useUser();
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-2">
      <h1 className="text-3xl font-semibold">{current?.name}</h1>
    </div>
  );
};
