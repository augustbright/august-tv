"use client";

// TODO i18n

import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { cssTransition, ToastContainer } from "react-toastify";
import { getQueryClient } from "@/queries/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfirmProvider } from "@/app/confirm";

const Swirl = cssTransition({
    enter: "animate__animated animate__fadeInUp animate__faster",
    exit: "animate__animated animate__fadeOut animate__faster",
});

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
                position="bottom-left"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="dark"
                transition={Swirl}
            />
        </QueryClientProvider>
    );
};
