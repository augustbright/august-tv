"use client";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

type TSidebarItems = {
  name: string;
  href: string;
  segment: string;
}[];

export const LayoutWithSidebar = ({
  children,
  sidebarItems,
  sidebarHeader,
}: {
  children: React.ReactNode;
  sidebarItems: TSidebarItems;
  sidebarHeader: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <Sidebar header={sidebarHeader} items={sidebarItems} />
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({
  header,
  items,
}: {
  header: React.ReactNode;
  items: TSidebarItems;
}) => {
  const segment = useSelectedLayoutSegment();
  return (
    <div className="relative">
      <div className="fixed flex flex-col gap-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">{header}</h1>
        </div>

        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("text-primary", {
                "font-semibold": segment === item.segment,
              })}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
