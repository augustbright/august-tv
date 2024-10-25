import { toast } from '@/components/hooks/use-toast';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { CategoryForm, formSchema } from './category-form-schema';

export const AddCategoryForm = ({
  onAddCategory,
  loading
}: {
  onAddCategory: (category: CategoryForm) => Promise<void>;
  loading?: boolean;
}) => {
  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
    disabled: loading
  });

  const handleSubmit = async (values: CategoryForm) => {
    try {
      await onAddCategory(values);
      form.reset();
      toast.success('Category added');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add category');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='flex gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='grow'>
                <FormControl>
                  <Input
                    {...field}
                    type='text'
                    placeholder='Category name'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={loading}
          >
            <Icon
              icon={Plus}
              loading={loading}
              className='h-4 w-4 mr-2'
            />
            Add category
          </Button>
        </div>
      </form>
    </Form>
  );
};
