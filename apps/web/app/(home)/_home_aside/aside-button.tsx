import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

export const AsideButton = ({
  icon,
  segment,
  href,
  title
}: {
  segment: string | null;
  href: string;
  title: string;
  icon: React.ComponentType;
}) => {
  const currentSegment = useSelectedLayoutSegment();
  return (
    <Link href={href}>
      <Button
        size='lg'
        variant='ghost'
        className={cn(
          'flex flex-col h-16 w-full px-2',
          currentSegment === segment && 'text-rose-600'
        )}
      >
        <Icon
          icon={icon}
          className='w-8'
        />
        <span className='text-xs'>{title}</span>
      </Button>
    </Link>
  );
};
