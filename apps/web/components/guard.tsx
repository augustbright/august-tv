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
    ...queryProps
}: {
    children:
        | React.ReactNode
        | ((currentUser: {
              data: NonNullable<
                  DTO["user"]["getCurrentUser"]["response"]["data"]
              >;
          }) => React.ReactNode);
    fallback: React.ReactNode;
} & TQueryChildrenProps<DTO["user"]["getCurrentUser"]["response"]>) => {
    return (
        <Query query={queryCurrentUser()} {...queryProps}>
            {({ data: currentUser }) => {
                if (!currentUser.data) {
                    return <>{fallback}</>;
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
