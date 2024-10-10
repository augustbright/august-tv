"use client";
import { Guard } from "@/components/guard";
import { SignInButton } from "@/components/sign-in-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export const AppUserPanel = () => {
    const { initials, signOut } = useUser();

    return (
        <Guard fallback={<SignInButton variant="outline" />}>
            {(current) => (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage
                                src={current.data.picture?.small.publicUrl}
                            />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            {current.data.nickname}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/profile">
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => signOut.mutate()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </Guard>
    );
};
