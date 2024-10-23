import { getMediaById } from '@/api/media';
import { Query } from '@/components/Query';
import { checkExhaustiveness } from '@august-tv/common';

export const SwitchVideoVisibility = ({
  mediaId,
  forDraft,
  forPublic,
  forPrivate,
  forUnlisted
}: {
  mediaId: string;
  forDraft?: React.ReactNode;
  forPublic?: React.ReactNode;
  forPrivate?: React.ReactNode;
  forUnlisted?: React.ReactNode;
}) => (
  <Query query={getMediaById.query({ mediaId })}>
    {({ data: video }) => {
      switch (video.visibility) {
        case 'DRAFT':
          return forDraft;
        case 'PUBLIC':
          return forPublic;
        case 'PRIVATE':
          return forPrivate;
        case 'UNLISTED':
          return forUnlisted;
        default:
          checkExhaustiveness(video.visibility);
          return null;
      }
    }}
  </Query>
);
