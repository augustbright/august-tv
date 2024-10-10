"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { getQueryClient } from "@/queries/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfirmProvider } from "@/app/confirm";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = getQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <TooltipProvider>
                    <ConfirmProvider>{children}</ConfirmProvider>
                </TooltipProvider>
            </ThemeProvider>
            <ToastContainer
                hideProgressBar
                position="bottom-left"
                theme="dark"
            />
        </QueryClientProvider>
    );
};
