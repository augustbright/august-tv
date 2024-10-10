"use client";
import { CircleHelp } from "lucide-react";
import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    children: React.ReactNode;
    fallback?: (error: Error | null) => React.ReactNode;
};

type State = {
    hasError: boolean;
    error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: unknown) {
        console.log(error);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        if (this.props.fallback) return this.props.fallback(this.state.error);

        return (
            <Tooltip>
                <TooltipTrigger>
                    <p className="text-destructive flex gap-2 items-center justify-center">
                        <span>Something went wrong</span>
                        <CircleHelp className="w-4 h-4" />
                    </p>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        Error:{" "}
                        {this.state.error?.message ??
                            "An unknown error has occurred. Please try again"}
                    </p>
                </TooltipContent>
            </Tooltip>
        );
    }
}
