"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
    nickname: z
        .string({
            required_error: "Nickname is required",
        })
        .max(100, "Nickname is too long"),
    firstname: z.string().max(100, "Firstname is too long").optional(),
    lastname: z.string().max(100, "Lastname is too long").optional(),
});

export const GeneralForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nickname: "",
            firstname: "",
        },
    });

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.dir(values);
            // await updateProfile(values);
            toast.success("Profile updated");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        }
    }

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <div className="grid w-full max-w-sm items-center gap-1.5"></div>

                <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nickname</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Your public nickname"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" variant="default">
                    <Save className="mr-2" />
                    <span>Save</span>
                </Button>
            </form>
        </Form>
    );
};
