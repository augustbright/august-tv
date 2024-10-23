import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { ThumbnailInput } from './thumbnail-input';
import { TVideoEditorForm } from './video-editor-form-schema';

export const VideoEditorFieldThumbnail = ({
  form,
  mediaId
}: {
  form: TVideoEditorForm;
  mediaId: string;
}) => {
  return (
    <FormField
      control={form.control}
      name='thumbnailImageId'
      render={({ field }) => (
        <FormItem>
          <div className='space-y-0.5'>
            <FormLabel>Thumbnail</FormLabel>
          </div>
          <FormControl>
            <ThumbnailInput
              {...field}
              mediaId={mediaId}
              className='flex flex-col rounded-lg border p-4 h'
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
