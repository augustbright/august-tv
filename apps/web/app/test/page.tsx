"use client";

import { Button } from "@/components/ui/button";
import anime from "animejs";
import { useRef } from "react";

export default function TestPage() {
    const elRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <div className="flex flex-col gap-5 items-center">
            <h1 className="text-2xl font-bold">Test Page</h1>
            <Button
                ref={buttonRef}
                onClick={() => {
                    anime({
                        targets: elRef.current,
                        keyframes: [
                            {
                                duration: 0,
                                scale: 1,
                                borderWidth: 1,
                                opacity: 1,
                            },
                            {
                                easing: "easeOutQuart",
                                duration: 1000,
                                scale: 6,
                                borderWidth: 4,
                                opacity: 0,
                            },
                        ],
                    });
                }}
            >
                Animate
                <div
                    ref={elRef}
                    className="absolute w-5 h-5 opacity-0 pointer-events-none rounded-full bg-transparent border-pink-600 border"
                />
            </Button>
        </div>
    );
}
