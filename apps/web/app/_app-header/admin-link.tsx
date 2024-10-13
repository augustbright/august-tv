"use client";

import { Guard } from "@/components/guard";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wrench } from "lucide-react";
import Link from "next/link";

<Link href="/admin">
    <Button variant="outline">
        <Wrench className="mr-2 h-5 w-5" />
        <span>Admin tools</span>
    </Button>
</Link>;

export const AdminLink = () => {
    return (
        <Guard roles={["ADMIN"]} fallback={null}>
            {() => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Wrench className="mr-2 h-5 w-5" />
                            <span>Admin tools</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/dashboard">
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/youtube">
                                <span>Import from Youtube</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/test-job">
                                <span>Jobs Tester</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </Guard>
    );
};
