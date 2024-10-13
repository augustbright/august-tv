"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DTO } from "@august-tv/dto";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { debounce } from "lodash";
import { querySearchUsers } from "@/queries/searchUsers";
import { Query } from "@/components/Query";
import { AuthorPicture } from "@/components/AuthorPicture";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Guard } from "@/components/guard";
import { cn } from "@/lib/utils";

export type TUserItem = Pick<
    DTO["user"]["searchUsers"]["response"]["data"][0],
    "id" | "nickname" | "email" | "picture"
>;

type TSingleUserInputProps = {
    single: true;
    value: TUserItem | undefined;
    onChange: (event: { target: { value: TUserItem | undefined } }) => void;
};

type TMultipleUserInputProps = {
    single?: false;
    value: TUserItem[] | undefined;
    onChange: (event: { target: { value: TUserItem[] } }) => void;
};

const onlyDefined = <T,>(value: (T | undefined)[]): T[] =>
    value.filter(Boolean) as T[];

export const UserInput = (
    props: TSingleUserInputProps | TMultipleUserInputProps
) => {
    const [enableSearch, setEnableSearch] = useState(false);

    const [search, setSearch] = useState("");
    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        handleSearch(event.target.value);
    };

    const [query, setQuery] = useState("");
    const handleSearch = debounce(async (query: string) => {
        setQuery(query);
        setEnableSearch(true);
    }, 300);

    return (
        <Guard fallback={null}>
            {({ data: me }) => {
                const iAmIncluded = props.single
                    ? props.value?.id === me.id
                    : props.value?.some((u) => u.id === me.id);

                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4 flex-wrap">
                            <Table>
                                <TableBody>
                                    {onlyDefined([props.value].flat()).map(
                                        (user) => (
                                            <TableRow
                                                key={user.id}
                                                className="flex items-center gap-2 rounded-md p-2"
                                            >
                                                <TableCell>
                                                    <AuthorPicture
                                                        author={user}
                                                    />
                                                </TableCell>
                                                <TableCell className="w-full">
                                                    <div className="flex gap-2 items-center">
                                                        <span>
                                                            {user.nickname}
                                                        </span>
                                                        {user.id === me.id && (
                                                            <div className="text-slate-500">
                                                                (You)
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => {
                                                            if (props.single) {
                                                                props.onChange({
                                                                    target: {
                                                                        value: undefined,
                                                                    },
                                                                });
                                                            } else {
                                                                props.onChange({
                                                                    target: {
                                                                        value:
                                                                            props.value?.filter(
                                                                                (
                                                                                    u
                                                                                ) =>
                                                                                    u.id !==
                                                                                    user.id
                                                                            ) ||
                                                                            [],
                                                                    },
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Trash className="w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex justify-start gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={"outline"}>
                                        <Plus className="mr-2" />
                                        <span>Add user</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-80">
                                    <Input
                                        type="search"
                                        placeholder="Search users"
                                        value={search}
                                        onChange={handleChangeInput}
                                        autoFocus
                                    />
                                    <DropdownMenuSeparator />
                                    {!enableSearch && (
                                        <p className="text-slate-500 text-center p-4">
                                            Start typing to search users
                                        </p>
                                    )}
                                    <Query
                                        loading={Query.LOADING.ROW}
                                        error={Query.ERROR.TEXT}
                                        query={{
                                            ...querySearchUsers({
                                                query,
                                                limit: 10,
                                            }),
                                            enabled: enableSearch,
                                        }}
                                    >
                                        {({ data: { data: users } }) =>
                                            users.map((user) => {
                                                const isSelected = onlyDefined(
                                                    [props.value].flat()
                                                ).some((u) => u.id === user.id);
                                                return (
                                                    <DropdownMenuItem
                                                        key={user.id}
                                                        onClickCapture={(e) => {
                                                            e.stopPropagation();
                                                            if (props.single) {
                                                                props.onChange({
                                                                    target: {
                                                                        value: user,
                                                                    },
                                                                });
                                                            } else {
                                                                props.onChange({
                                                                    target: {
                                                                        value: [
                                                                            ...(props.value ||
                                                                                []),
                                                                            user,
                                                                        ],
                                                                    },
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    checked={
                                                                        isSelected
                                                                    }
                                                                />
                                                            </div>
                                                            <AuthorPicture
                                                                author={user}
                                                            />
                                                            <div className="flex flex-col gao-1">
                                                                <div className="font-semibold">
                                                                    {
                                                                        user.nickname
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-slate-500">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DropdownMenuItem>
                                                );
                                            })
                                        }
                                    </Query>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                type="button"
                                variant="outline"
                                className={cn(iAmIncluded && "hidden")}
                                onClickCapture={(e) => {
                                    e.stopPropagation();
                                    if (props.single) {
                                        props.onChange({
                                            target: {
                                                value: me,
                                            },
                                        });
                                    } else {
                                        props.onChange({
                                            target: {
                                                value: [
                                                    ...(props.value || []),
                                                    me,
                                                ],
                                            },
                                        });
                                    }
                                }}
                            >
                                Include me
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className={cn(!iAmIncluded && "hidden")}
                                onClickCapture={(e) => {
                                    e.stopPropagation();
                                    if (props.single) {
                                        props.onChange({
                                            target: {
                                                value: undefined,
                                            },
                                        });
                                    } else {
                                        props.onChange({
                                            target: {
                                                value:
                                                    props.value?.filter(
                                                        (u) => u.id !== me.id
                                                    ) || [],
                                            },
                                        });
                                    }
                                }}
                            >
                                Exclude me
                            </Button>
                        </div>
                    </div>
                );
            }}
        </Guard>
    );
};
