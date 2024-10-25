import { z } from 'zod';

export const formSchema = z.object({
  name: z.string({ required_error: 'Category name is required' })
});

export type CategoryForm = z.infer<typeof formSchema>;
