"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Query, TQueryChildrenProps } from "./Query";
import { queryCurrentUser } from "@/queries/currentUser";
import { TUserEndpointResult } from "@august-tv/dto";

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
              currentUser: NonNullable<TUserEndpointResult<"getCurrentUser">>
          ) => React.ReactNode);
    fallback: React.ReactNode;
    fallbackNoPermission?: React.ReactNode;
    roles?: string[];
} & TQueryChildrenProps<TUserEndpointResult<"getCurrentUser">>) => {
    return (
        <Query query={queryCurrentUser()} loading={loading} {...queryProps}>
            {({ data: currentUser }) => {
                if (!currentUser?.data) {
                    return <>{fallback}</>;
                }
                if (roles?.length) {
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
