import { TYoutubeEndpointResult } from '@august-tv/generated-types';
import { YoutubeImportRequestDto } from '@august-tv/generated-types/dto/YoutubeImportRequestDto';

import { createMutableEndpoint } from './createMutableEndpoint';

export const postYoutubeImport = createMutableEndpoint<
  YoutubeImportRequestDto,
  TYoutubeEndpointResult<'importFromYoutube'>
>({
  method: 'post',
  prepareUrl: () => '/youtube/importFromYoutube'
});
