import { AdminSidebar } from "./_admin-sidebar";
import { Guard, RedirectHome } from "@/components/guard";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Guard
            roles={["ADMIN"]}
            error={RedirectHome}
            fallback={<RedirectHome />}
        >
            <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold">Admin tools</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <AdminSidebar />
                    {children}
                </div>
            </div>
        </Guard>
    );
}
