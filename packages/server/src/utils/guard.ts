import { SetMetadata } from '@nestjs/common';

export const GUARD_TAG = 'GUARD_TAG';

type TScope = 'public' | 'user' | 'admin';

export const Guard = {
  scope: (scope: TScope) => SetMetadata(GUARD_TAG, { scope }),
};
