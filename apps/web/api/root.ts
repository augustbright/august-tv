import { createReadableEndpoint } from './createReadableEndpoint';

export const getHealth = createReadableEndpoint<void, { status: string }>({
  prepareUrl: () => '/health'
});
