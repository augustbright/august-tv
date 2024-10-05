import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import "./global.css";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "../components/Providers";
import { queryCurrentUser } from "@/queries/currentUser";
import { getQueryClient } from "@/queries/queryClient";
import { AppHeader } from "./_app-header/app-header";

export const metadata = {
    title: "August TV",
    description: "Watch your favorite videos here!",
};

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(queryCurrentUser());

    return (
        <html lang="en">
            <body>
                <Providers>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <div className="flex flex-col">
                            <AppHeader />
                            {children}
                        </div>
                    </HydrationBoundary>
                </Providers>
            </body>
        </html>
    );
}
