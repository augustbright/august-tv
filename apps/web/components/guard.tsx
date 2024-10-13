"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Query, TQueryChildrenProps } from "./Query";
import { queryCurrentUser } from "@/queries/currentUser";
import { DTO } from "@august-tv/dto";

export const RedirectHome = () => {
    useEffect(() => {
        redirect("/");
    });
    return null;
};

export const Guard = ({
    children,
    fallback,
    roles,
    fallbackNoPermission,
    loading = Query.LOADING.NONE,
    ...queryProps
}: {
    children:
        | React.ReactNode
        | ((
              currentUser: NonNullable<
                  DTO["user"]["getCurrentUser"]["response"]
              >
          ) => React.ReactNode);
    fallback: React.ReactNode;
    fallbackNoPermission?: React.ReactNode;
    roles?: string[];
} & TQueryChildrenProps<DTO["user"]["getCurrentUser"]["response"]>) => {
    return (
        <Query query={queryCurrentUser()} loading={loading} {...queryProps}>
            {({ data: currentUser }) => {
                if (!currentUser?.data) {
                    return <>{fallback}</>;
                }
                if (roles && roles.length) {
                    if (
                        !currentUser.roles.some((role) =>
                            roles.includes(role.name)
                        )
                    ) {
                        return fallbackNoPermission || fallback;
                    }
                }
                return typeof children === "function"
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      children(currentUser as any)
                    : children;
            }}
        </Query>
    );
};

Guard.RedirectHome = RedirectHome;
