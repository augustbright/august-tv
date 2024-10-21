import { TJobsEndpointResult } from '@august-tv/generated-types';

import { createMutableEndpoint } from './createMutableEndpoint';

export const postJobsTest = createMutableEndpoint<
  {
    name: string;
    description: string;
    payload: object;
    stage: string;
    timeout: number;
    observers: string[];
  },
  TJobsEndpointResult<'testJob'>
>({
  method: 'post',
  prepareUrl: () => '/jobs/test'
});
