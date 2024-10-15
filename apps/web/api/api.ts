import { buildApi } from './api-builder/api-builder';
import { makeAwesomeApiProcessor } from './api-builder/api-processor';

const _api = buildApi({
  feed: {
    latest: true,
    subscriptions: true
    // TODO feedPopular
  },
  user: {
    verifyToken: true,
    sessionLogin: true,
    'sign-out': true,
    current: true,
    myJobs: true,
    unobserveJob: true,
    mySubscriptions: true,
    subscribe: true,
    unsubscribe: true,
    search: true,
    profilePictures: true,
    uploadProfilePicture: true,
    updateProfilePicture: true,
    unsetProfilePicture: true
  },
  media: {
    $: true,
    rate: {
      $: true
    },
    upload: true,
    my: true,
    edit: {
      $: true
    }
  },
  youtube: {
    importFromYoutube: true
  },
  jobs: {
    test: true
  }
});

export const api = makeAwesomeApiProcessor(_api);
