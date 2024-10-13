"use client";

import { Guard } from "@/components/guard";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import Link from "next/link";

export const AdminLink = () => {
    return (
        <Guard roles={["ADMIN"]} fallback={null}>
            {() => (
                <Link href="/admin">
                    <Button variant="outline">
                        <Wrench className="mr-2 h-5 w-5" />
                        <span>Admin tools</span>
                    </Button>
                </Link>
            )}
        </Guard>
    );
};
