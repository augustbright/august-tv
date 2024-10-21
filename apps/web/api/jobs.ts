import { TJobTestParams } from '@august-tv/common/types';
import { TJobsEndpointResult } from '@august-tv/generated-types';

import { createMutableEndpoint } from './createMutableEndpoint';

export const postJobsTest = createMutableEndpoint<
  TJobTestParams,
  TJobsEndpointResult<'testJob'>
>({
  method: 'post',
  prepareUrl: () => '/jobs/test'
});
