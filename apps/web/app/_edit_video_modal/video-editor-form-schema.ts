import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
    title: z
        .string({
            required_error: 'Title is required'
        })
        .min(1, 'Title is required')
        .max(255, 'Title is too long'),
    description: z.string().max(1000, 'Description is too long'),
    visibility: z.enum(['PRIVATE', 'UNLISTED', 'PUBLIC'], {
        required_error: 'Please select a visibility option'
    }),
    thumbnailImageId: z.string().optional()
});

export type TVideoEditorForm = UseFormReturn<z.infer<typeof formSchema>>;