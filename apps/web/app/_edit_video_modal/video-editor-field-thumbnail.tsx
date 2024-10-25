import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { TVideoEditorForm } from './form-schema';
import { ThumbnailInput } from './thumbnail-input';

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
