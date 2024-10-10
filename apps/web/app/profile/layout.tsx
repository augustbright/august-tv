import { ProfileHeader } from "./profile-header";
import { ProfileSidebar } from "./profile-sidebar";
import { Guard, RedirectHome } from "@/components/guard";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Guard error={RedirectHome} fallback={<RedirectHome />}>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <ProfileHeader />
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <ProfileSidebar />
                    {children}
                </div>
            </main>
        </Guard>
    );
}
