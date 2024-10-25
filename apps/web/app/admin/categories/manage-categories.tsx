'use client';

import { getCategories, postCategories } from '@/api/categories';
import { Query } from '@/components/Query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { AddCategoryForm } from './add-category-form';
import { CategoryForm } from './category-form-schema';
import { CategoryRow } from './category-row';

export const ManageCategories = () => {
  const { mutateAsync: addCategory, isPending: isAddingCategory } =
    postCategories.useMutation();

  const handleAddCategory = async (category: CategoryForm) => {
    await addCategory(category);
  };

  return (
    <Card className='flex flex-col gap-4'>
      <CardHeader>
        <CardTitle>Manage Categories</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3'>
          <Query query={getCategories.query()}>
            {({ data: categories }) =>
              categories.map((category) => (
                <CategoryRow
                  category={category}
                  key={category.id}
                />
              ))
            }
          </Query>
        </div>
        <Separator className='my-3' />
        <Label>Add Category</Label>
        <AddCategoryForm
          onAddCategory={handleAddCategory}
          loading={isAddingCategory}
        />
      </CardContent>
    </Card>
  );
};
