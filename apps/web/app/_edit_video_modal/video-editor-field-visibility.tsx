import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { TVideoEditorForm } from './form-schema';

export const VideoEditorFieldVisibility = ({
  form
}: {
  form: TVideoEditorForm;
}) => {
  return (
    <FormField
      control={form.control}
      name='visibility'
      render={({ field }) => (
        <FormItem>
          <div className='space-y-0.5'>
            <FormLabel>Publish video</FormLabel>
          </div>
          <FormControl>
            <RadioGroup
              {...field}
              className='flex flex-col rounded-lg border p-4 h'
            >
              <div className='flex items-start space-x-2'>
                <RadioGroupItem
                  value='PUBLIC'
                  id='public'
                  className='mt-1'
                  onClick={() => {
                    form.setValue('visibility', 'PUBLIC');
                  }}
                />
                <Label htmlFor='public'>
                  Public
                  <p className='text-sm text-gray-500'>
                    Everyone can view the video
                  </p>
                </Label>
              </div>
              <div className='flex items-start space-x-2'>
                <RadioGroupItem
                  value='PRIVATE'
                  id='private'
                  className='mt-1'
                  onClick={() => {
                    form.setValue('visibility', 'PRIVATE');
                  }}
                />
                <Label htmlFor='private'>
                  Private
                  <p className='text-sm text-gray-500'>
                    Only you can view the video
                  </p>
                </Label>
              </div>
              <div className='flex items-start space-x-2'>
                <RadioGroupItem
                  value='UNLISTED'
                  id='unlisted'
                  onClick={() => {
                    form.setValue('visibility', 'UNLISTED');
                  }}
                />
                <Label htmlFor='unlisted'>
                  Unlisted
                  <p className='text-sm text-gray-500'>
                    Only people with the link can view the video
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
