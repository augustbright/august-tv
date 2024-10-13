"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useMutateUploadRandomFromYoutube } from "@/mutations/uploadRandomFromYoutube";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { z } from "zod";
import { UserInput } from "../user-input";

const formSchema = z.object({
    author: z.object(
        {
            id: z.string(),
            nickname: z.string(),
            email: z.string(),
            picture: z.object({
                small: z.object({
                    publicUrl: z.string(),
                }),
            }),
        },
        {
            required_error: "Author is required",
        }
    ),
});

export const UploadFromYoutube = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
        mode: "onSubmit",
    });

    const { mutateAsync: startImporting, isPending } =
        useMutateUploadRandomFromYoutube();

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            await startImporting(values.author.id);
            toast.success("Importing started");
        } catch (error) {
            console.error(error);
            toast.error("Failed to start importing");
        }
    }
    return (
        <Card className="flex flex-col gap-4">
            <CardHeader>
                <CardTitle>Import from Youtube</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="author"
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
                        <Button disabled={isPending} type="submit">
                            Start Importing
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
