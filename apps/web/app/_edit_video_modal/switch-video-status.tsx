import { getMediaById } from '@/api/media';
import { Query } from '@/components/Query';
import { checkExhaustiveness } from '@august-tv/common';

export const SwitchVideoStatus = ({
  mediaId,
  processing,
  ready,
  deleted,
  error
}: {
  mediaId: string;
  processing?: React.ReactNode;
  ready?: React.ReactNode;
  deleted?: React.ReactNode;
  error?: React.ReactNode;
}) => (
  <Query query={getMediaById.query({ mediaId })}>
    {({ data: video }) => {
      switch (video.status) {
        case 'PROCESSING':
          return processing;
        case 'READY':
          return ready;
        case 'DELETED':
          return deleted;
        case 'ERROR':
          return error;
        default:
          checkExhaustiveness(video.status);
          return null;
      }
    }}
  </Query>
);
