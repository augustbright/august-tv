import { getCategories } from '@/api/categories';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { AsyncSelect } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';

import { TVideoEditorForm } from './form-schema';

export const VideoEditorFieldCategory = ({
  form
}: {
  form: TVideoEditorForm;
}) => {
  const queryClient = useQueryClient();
  return (
    <FormField
      control={form.control}
      name='category'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category (optional)</FormLabel>
          <AsyncSelect
            {...field}
            isClearable
            defaultOptions
            loadOptions={async () => {
              const categories = await queryClient.fetchQuery(
                getCategories.query()
              );
              return categories.map((category) => ({
                value: category.id,
                label: category.name
              }));
            }}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
