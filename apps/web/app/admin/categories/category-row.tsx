import { deleteCategories, patchCategories } from '@/api/categories';
import { useConfirm } from '@/app/confirm';
import { toast } from '@/components/hooks/use-toast';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

import { MoreVertical, Save, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { CategoryForm, formSchema } from './category-form-schema';

export const CategoryRow = ({
  category
}: {
  category: {
    name: string;
    id: number;
  };
}) => {
  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name
    }
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const handleOpenChange = () => {
    setIsFormOpen(false);
    form.reset();
  };

  const { mutateAsync: updateCategory, isPending: isUpdatingCategory } =
    patchCategories.useMutation();
  const { mutateAsync: deleteCategory, isPending: isDeletingCategory } =
    deleteCategories.useMutation();

  const handleClickRow = () => {
    if (!isUpdatingCategory && !isDeletingCategory) {
      setIsFormOpen(true);
    }
  };

  const handleSubmit = async (values: CategoryForm) => {
    try {
      await updateCategory({ data: values, id: category.id });
      form.reset();
      setIsFormOpen(false);
      toast.success('Category updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update category');
    }
  };
  const confirm = useConfirm();
  const handleDelete = async () => {
    confirm({
      title: `Delete category "${category.name}?"`,
      continueText: 'Delete',
      async onContinue() {
        try {
          await deleteCategory({ id: category.id });
          setIsFormOpen(false);
          toast.success('Category deleted');
        } catch (error) {
          console.error(error);
          toast.error('Failed to delete category');
        }
      }
    });
  };

  return (
    <>
      <div
        role='button'
        onClick={handleClickRow}
        className='border rounded-lg p-2 w-full flex items-center justify-between hover:bg-accent'
      >
        <span>{category.name}</span>
      </div>

      <Dialog
        open={isFormOpen}
        onOpenChange={handleOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <h2>Category: {category.name}</h2>
          </DialogHeader>
          <Form {...form}>
            <form
              className='flex flex-col gap-4'
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
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
              <DialogFooter>
                {!isUpdatingCategory && !isDeletingCategory && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost'>
                        <MoreVertical className='h-4 2-4' />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleDelete}>
                        <Trash className='h-4 w-4 mr-2' />
                        Delete category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button
                  type='submit'
                  disabled={isUpdatingCategory || isDeletingCategory}
                >
                  <Icon
                    icon={Save}
                    loading={isUpdatingCategory || isDeletingCategory}
                    className='h-4 w-4 mr-2'
                  />
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
