"use client";
import { Icon } from "@/components/icon";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutateCreateTestJob } from "@/mutations/createTestJob";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { UserInput } from "../user-input";
import ReactJson from "react-json-view";
import { Prisma } from "@prisma/client";

const formSchema = z.object({
    name: z
        .string({
            required_error: "Job name is required",
        })
        .max(100, "Job name is too long"),
    timeout: z.coerce.number().int().positive(),
    description: z.string().max(500, "Job description is too long").optional(),
    stage: z.string().max(100, "Job stage is too long").optional(),
    payload: z
        .record(z.unknown(), {
            required_error: "Job payload is required",
        })
        .optional(),
    observers: z
        .array(
            z.object({
                id: z.string(),
                nickname: z.string(),
                email: z.string(),
                picture: z.object({
                    small: z.object({
                        publicUrl: z.string(),
                    }),
                }),
            })
        )
        .nonempty({
            message: "At least one observer is required",
        }),
});

export const JobTester = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
        mode: "onSubmit",
    });

    const { mutateAsync: createTestJob, isPending: isCreating } =
        useMutateCreateTestJob();

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createTestJob({
                name: values.name,
                description: values.description,
                payload: (values.payload ?? {}) as Prisma.JsonObject,
                stage: values.stage,
                timeout: values.timeout,
                observers: values.observers.map((observer) => observer.id),
            });
            toast.success("Profile updated");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create test job");
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Job tester</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <div className="grid w-full max-w-sm items-center gap-1.5"></div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Test job name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="timeout"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Timeout (ms)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Test job timeout"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Test job description"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="stage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stage</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Test job stage"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="observers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observers</FormLabel>
                                    <FormControl>
                                        <UserInput
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
                            name="payload"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payload</FormLabel>
                                    <FormControl>
                                        <ReactJson
                                            src={field.value as object}
                                            onEdit={({ updated_src }) =>
                                                field.onChange(updated_src)
                                            }
                                            onAdd={({ updated_src }) =>
                                                field.onChange(updated_src)
                                            }
                                            onDelete={({ updated_src }) =>
                                                field.onChange(updated_src)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            variant="default"
                            disabled={isCreating}
                        >
                            <Icon
                                icon={Plus}
                                loading={isCreating}
                                className="mr-2"
                            />
                            <span>Create</span>
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
