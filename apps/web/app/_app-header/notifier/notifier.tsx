"use client";
import { Guard } from "@/components/guard";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { Bell, Loader2 } from "lucide-react";
import { ActiveJobs } from "./activeJobs";

export const Notifier = () => {
    const { activeJobs } = useUser();

    return (
        <Guard fallback={null}>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button size="icon" variant="ghost">
                        {activeJobs.length > 0 ? (
                            <>
                                <Bell className="h-3 w-3" />
                                <Loader2 className="h-8 w-8 absolute animate-spin" />
                                {activeJobs.length}
                            </>
                        ) : (
                            <Bell className="h-6 w-6" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ActiveJobs />
                </DropdownMenuContent>
            </DropdownMenu>
        </Guard>
    );
};
