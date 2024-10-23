'use client';

import { postYoutubeImport } from '@/api/youtube';
import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/useUser';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { UserInput } from '../user-input';

const formSchema = z.object({
  author: z.object(
    {
      id: z.string(),
      nickname: z.string(),
      email: z.string(),
      picture: z
        .object({
          small: z.object({
            publicUrl: z.string()
          })
        })
        .nullable()
    },
    {
      required_error: 'Author is required'
    }
  ),
  publicImmediately: z.boolean().optional().default(true),
  numberOfVideos: z.coerce
    .number()
    .int()
    .positive()
    .lte(10, 'Maximum 10 videos')
    .default(1),
  channelId: z.string().optional(),
  videoId: z.string().optional()
});

export const UploadFromYoutube = () => {
  const { current } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    mode: 'onSubmit'
  });

  const { mutateAsync: startImporting, isPending } =
    postYoutubeImport.useMutation();

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await startImporting({
        videoId: values.videoId,
        channelId: values.channelId,
        numberOfVideos: values.numberOfVideos,
        authorId: values.author.id,
        publicImmediately: values.publicImmediately,

        observers: [current!.data.id]
      });
      toast.success('Importing started');
    } catch (error) {
      console.error(error);
      toast.error('Failed to start importing');
    }
  }
  return (
    <Card className='flex flex-col gap-4'>
      <CardHeader>
        <CardTitle>Import from Youtube</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='flex flex-col gap-4'
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name='videoId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video ID (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      placeholder='Video ID'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='channelId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel ID (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      placeholder='Channel ID'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='author'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <UserInput
                      single
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='numberOfVideos'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of videos</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      placeholder='Number of videos'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-start'>
              <Button
                disabled={isPending}
                type='submit'
              >
                Start Importing
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
