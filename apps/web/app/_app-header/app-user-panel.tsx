"use client";
import { Guard } from "@/components/guard";
import { SignInButton } from "@/components/sign-in-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@/hooks/useUser";
import { Clapperboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const AppUserPanel = () => {
    const { initials, signOut } = useUser();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const handleSheetOpenChange = (open: boolean) => {
        setIsSheetOpen(open);
    };
    const handleClickNavItem = () => {
        setIsSheetOpen(false);
    };

    return (
        <Guard fallback={<SignInButton variant="outline" />}>
            {(current) => (
                <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
                    <SheetTrigger>
                        <Avatar>
                            <AvatarImage
                                src={current.data.picture?.small.publicUrl}
                            />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            current.data.picture?.small
                                                .publicUrl
                                        }
                                    />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <p>{current.data.nickname}</p>
                            </SheetTitle>
                        </SheetHeader>
                        <SheetDescription className="flex flex-col gap-1">
                            <Button asChild variant={"ghost"}>
                                <Link
                                    href="/profile/general"
                                    className="flex gap-2 p-4"
                                    onClick={handleClickNavItem}
                                >
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </Button>
                            <Button asChild variant={"ghost"}>
                                <Link
                                    href="/profile/my-videos"
                                    className="flex gap-2 p-4"
                                    onClick={handleClickNavItem}
                                >
                                    <Clapperboard className="h-4 w-4" />
                                    <span>My Videos</span>
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => {
                                    signOut.mutate();
                                    handleClickNavItem();
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sign out</span>
                            </Button>

                            {/* TODO: terms of use */}
                        </SheetDescription>
                    </SheetContent>
                </Sheet>
            )}
        </Guard>
    );
};
