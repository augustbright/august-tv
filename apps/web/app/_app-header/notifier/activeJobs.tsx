import { postUserUnobserveJob } from '@/api/user';
import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';

import { EyeOff } from 'lucide-react';

const STATUS_NAMES = {
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  FAILED: 'Failed'
} as const;

export const ActiveJobs = () => {
  const { activeJobs } = useUser();
  const { mutateAsync: unobserveJob, isPending: isUnobservingJob } =
    postUserUnobserveJob.useMutation();
  return activeJobs.map((job) => (
    <DropdownMenuItem
      key={job.id}
      className='flex'
    >
      <div className='grow'>
        <div className='flex flex-col gap-2 grow'>
          <div className='flex-1 font-bold flex items-center'>
            {(job.status !== 'IN_PROGRESS' || job.progress > 1) && (
              <Badge
                className={cn(
                  'text-xs mr-2',
                  job.status === 'DONE' ? 'bg-green-500' : 'bg-blue-500'
                )}
                variant='default'
              >
                {job.status !== 'IN_PROGRESS' && (
                  <span>{STATUS_NAMES[job.status]}</span>
                )}
                {job.status !== 'DONE' && job.progress + '%'}
              </Badge>
            )}
            <span>{job.name}</span>
          </div>
        </div>
      </div>
      <div>
        {job.stage && job.status !== 'DONE' && (
          <div className='text-xs text-gray-400'>{job.stage}</div>
        )}
        <div className='grow' />
        <Button
          variant='ghost'
          size='sm'
          onClick={() => unobserveJob({ jobId: job.id })}
        >
          <Icon
            icon={EyeOff}
            loading={isUnobservingJob}
            className='h-4 w-4 ml-2'
          />
        </Button>
      </div>
    </DropdownMenuItem>
  ));
};
