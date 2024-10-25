import { getTagsSearch, postTagsCreate } from '@/api/tags';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { AsyncCreatableSelect } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';

import { TVideoEditorForm } from './form-schema';

export const VideoEditorFieldTags = ({ form }: { form: TVideoEditorForm }) => {
  const queryClient = useQueryClient();
  const { mutateAsync: createTag, isPending: isCreatingTag } =
    postTagsCreate.useMutation();

  return (
    <FormField
      control={form.control}
      name='tags'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormDescription>
            You can add up to 10 tags. This will help others find your video.
          </FormDescription>
          <FormControl>
            <AsyncCreatableSelect
              {...field}
              placeholder='Add tags'
              maxSelections={10}
              maxSelectionsMessage='You can only select up to 10 tags.'
              isMulti
              cacheOptions
              isClearable
              isLoading={isCreatingTag}
              isDisabled={isCreatingTag}
              defaultOptions
              isOptionDisabled={() => field.value.length >= 10}
              formatCreateLabel={(inputValue) => `${inputValue}`}
              loadOptions={async (query) => {
                const tags = await queryClient.fetchQuery(
                  getTagsSearch.query({ query })
                );

                return tags.map((tag) => ({
                  label: tag.name,
                  value: tag.id
                }));
              }}
              onCreateOption={async (inputValue: string) => {
                const newTag = await createTag({ name: inputValue });
                field.onChange([
                  ...field.value,
                  { label: newTag.name, value: newTag.id }
                ]);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
