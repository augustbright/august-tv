'use client';

import { patchMedia } from '@/api/media';
import { toast } from '@/components/hooks/use-toast';
import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { File, Video } from '@prisma/client';
import { DialogDescription } from '@radix-ui/react-dialog';

import { Save, Sparkles } from 'lucide-react';
import { useController, useForm } from 'react-hook-form';
import { z } from 'zod';

import { SwitchVideoStatus } from './switch-video-status';
import { SwitchVideoVisibility } from './switch-video-visibility';
import { VideoEditorAside } from './video-editor-aside';
import { VideoEditorFieldTags } from './video-editor-field-tags';
import { VideoEditorFieldThumbnail } from './video-editor-field-thumbnail';
import { VideoEditorFieldVisibility } from './video-editor-field-visibility';
import { formSchema } from './video-editor-form-schema';

export const EditVideoForm = ({
  video
}: {
  video: Pick<
    Video,
    'id' | 'title' | 'visibility' | 'description' | 'status' | 'thumbnailId'
  > & { master: Pick<File, 'publicUrl'> | null } & {
    tags: { id: number; name: string }[];
  };
}) => {
  const { mutateAsync: updateVideo, isPending: isUpdatingVideo } =
    patchMedia.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: video.title,
      description: video.description ?? '',
      visibility: video.visibility,
      thumbnailImageId: video.thumbnailId ?? undefined,
      tags: video.tags.map((tag) => ({ value: tag.id, label: tag.name }))
    },
    disabled: isUpdatingVideo
  });

  const {
    field: { value: selectedThumbnailId }
  } = useController({
    control: form.control,
    name: 'thumbnailImageId'
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateVideo({
        mediaId: video.id,
        updateVideoDto: {
          ...values,
          tags: values.tags?.map((tag) => tag.value)
        }
      });
      toast({
        description: 'Video updated'
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Failed to update video'
      });
    }
  }

  const submit = () => form.handleSubmit(handleSubmit)();

  return (
    <Form {...form}>
      <form
        className='flex flex-col grow overflow-y-hidden'
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <DialogHeader className='p-3'>
          <DialogTitle>
            Video settings
            <Badge
              variant='default'
              className='ml-2'
            >
              {video.visibility}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            <SwitchVideoStatus
              mediaId={video.id}
              processing={
                <p className='text-sm text-gray-500'>
                  This video is currently being processed
                </p>
              }
            />
          </DialogDescription>
        </DialogHeader>

        <div className='grid flex-1 gap-1 grid-cols-3 grow overflow-y-hidden'>
          <div className='col-span-2 pr-4 overflow-y-auto'>
            <div className='flex flex-col gap-8 items-stretch ml-3'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        id='title'
                        type='text'
                        placeholder='My awesome video'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id='message'
                        placeholder='Describe your video...'
                        className='min-h-12 resize-none p-3'
                        rows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SwitchVideoStatus
                mediaId={video.id}
                ready={
                  <>
                    <VideoEditorFieldTags form={form} />
                    <VideoEditorFieldVisibility form={form} />
                    <VideoEditorFieldThumbnail
                      form={form}
                      mediaId={video.id}
                    />
                  </>
                }
              />
            </div>
          </div>
          <VideoEditorAside
            mediaId={video.id}
            selectedThumbnailId={selectedThumbnailId}
            className='mr-3'
          />
        </div>

        <DialogFooter className='p-3'>
          <SwitchVideoVisibility
            mediaId={video.id}
            forDraft={
              <SwitchVideoStatus
                mediaId={video.id}
                processing={
                  <Button
                    type='submit'
                    variant='default'
                    disabled={isUpdatingVideo}
                  >
                    <Icon
                      icon={Save}
                      loading={isUpdatingVideo}
                      className='mr-2'
                    />
                    <span>Save Draft</span>
                  </Button>
                }
                ready={
                  <>
                    <Button
                      type='submit'
                      variant='ghost'
                      disabled={isUpdatingVideo}
                    >
                      <Icon
                        icon={Save}
                        loading={isUpdatingVideo}
                        className='mr-2'
                      />
                      <span>Save Draft</span>
                    </Button>

                    <Button
                      type='button'
                      variant='default'
                      disabled={isUpdatingVideo}
                      onClick={() => {
                        form.setValue('visibility', 'PUBLIC');
                        submit();
                      }}
                    >
                      <Icon
                        icon={Sparkles}
                        loading={isUpdatingVideo}
                        className='mr-2'
                      />
                      <span>Publish</span>
                    </Button>
                  </>
                }
              />
            }
            forPublic={
              <Button
                type='submit'
                variant='default'
                disabled={isUpdatingVideo}
              >
                <Icon
                  icon={Save}
                  loading={isUpdatingVideo}
                  className='mr-2'
                />
                <span>Save</span>
              </Button>
            }
            forPrivate={
              <>
                <Button
                  type='button'
                  variant='ghost'
                  disabled={isUpdatingVideo}
                  onClick={() => {
                    form.setValue('visibility', 'PUBLIC');
                    submit();
                  }}
                >
                  <Icon
                    icon={Sparkles}
                    loading={isUpdatingVideo}
                    className='mr-2'
                  />
                  <span>Publish</span>
                </Button>

                <Button
                  type='submit'
                  variant='default'
                  disabled={isUpdatingVideo}
                >
                  <Icon
                    icon={Save}
                    loading={isUpdatingVideo}
                    className='mr-2'
                  />
                  <span>Save</span>
                </Button>
              </>
            }
            forUnlisted={
              <>
                <Button
                  type='button'
                  variant='ghost'
                  disabled={isUpdatingVideo}
                  onClick={() => {
                    form.setValue('visibility', 'PUBLIC');
                    submit();
                  }}
                >
                  <Icon
                    icon={Sparkles}
                    loading={isUpdatingVideo}
                    className='mr-2'
                  />
                  <span>Publish</span>
                </Button>

                <Button
                  type='submit'
                  variant='default'
                  disabled={isUpdatingVideo}
                >
                  <Icon
                    icon={Save}
                    loading={isUpdatingVideo}
                    className='mr-2'
                  />
                  <span>Save</span>
                </Button>
              </>
            }
          />
        </DialogFooter>
      </form>
    </Form>
  );
};
