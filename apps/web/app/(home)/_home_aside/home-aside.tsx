"use client";
import { House, SquarePlay } from "lucide-react";
import { AsideButton } from "./aside-button";

export const HomeAside = () => {
    return (
        <aside className="shrink-0 w-16">
            <div className="flex flex-col fixed">
                <AsideButton
                    href="/"
                    icon={House}
                    segment={null}
                    title="Home"
                />
                <AsideButton
                    href="/subscriptions"
                    icon={SquarePlay}
                    segment="subscriptions"
                    title="My Feed"
                />
            </div>
        </aside>
    );
};
