import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { useMutateUnobserveJob } from "@/mutations/unobserveJob";
import { EyeOff } from "lucide-react";
import moment from "moment";

const STATUS_NAMES = {
    IN_PROGRESS: "In Progress",
    DONE: "Done",
    FAILED: "Failed",
} as const;

export const ActiveJobs = () => {
    const { jobs: activeJobs } = useUser();
    const { mutateAsync: unobserveJob, isPending: isUnobservingJob } =
        useMutateUnobserveJob();
    return (
        <>
            {activeJobs.map((job) => (
                <DropdownMenuGroup
                    key={job.id}
                    className="flex flex-col gap-2 items-stretch p-2"
                >
                    <div className="flex gap-2 items-center">
                        <Badge
                            className={cn(
                                "text-xs",
                                job.status === "DONE"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                            )}
                            variant="default"
                        >
                            {STATUS_NAMES[job.status]}
                        </Badge>
                        {job.stage && (
                            <div className="text-xs text-gray-400">
                                {job.stage}
                            </div>
                        )}
                        <div className="grow" />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unobserveJob(job.id)}
                        >
                            Hide
                            <Icon
                                icon={EyeOff}
                                loading={isUnobservingJob}
                                className="h-4 w-4 ml-2"
                            />
                        </Button>
                    </div>
                    <div className="flex">
                        <div className="flex flex-col gap-2 grow">
                            <div className="flex-1 font-bold">{job.name}</div>
                            <div className="text-xs text-gray-400">
                                Started:{" "}
                                {moment(job.createdAt).format(
                                    "MMMM Do, YYYY h:mm A"
                                )}
                            </div>
                        </div>
                        <div className="flex shrink-0 justify-center items-center p-4">
                            {job.progress}%
                        </div>
                    </div>
                </DropdownMenuGroup>
            ))}
        </>
    );
};
