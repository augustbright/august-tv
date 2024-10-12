"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { House, SquarePlay } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export const HomeAside = () => {
    const segment = useSelectedLayoutSegment();
    return (
        <aside className="flex flex-col gap-4 shrink-0">
            <Link href="/">
                <Button
                    size="lg"
                    variant="ghost"
                    className={cn(
                        "flex flex-col h-16 w-full",
                        segment === null && "text-rose-600"
                    )}
                >
                    <House className="w-8" />
                    <span>Home</span>
                </Button>
            </Link>

            <Link href="/subscriptions">
                <Button
                    size="lg"
                    variant="ghost"
                    className={cn(
                        "flex flex-col h-16 w-full",
                        segment === "subscriptions" && "text-rose-600"
                    )}
                >
                    <SquarePlay className="w-8" />
                    <span>Subscriptions</span>
                </Button>
            </Link>
        </aside>
    );
};
