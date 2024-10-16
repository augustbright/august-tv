import { cn } from '@/lib/utils';

import { Loader2, LucideProps } from 'lucide-react';
import React from 'react';

export const Icon = React.forwardRef<
  SVGSVGElement,
  LucideProps & {
    icon: React.ComponentType<LucideProps>;
    loading?: boolean;
  }
>(({ icon, loading, className, ...props }, ref) => {
  const Comp = loading ? Loader2 : icon;

  return (
    <Comp
      ref={ref}
      className={cn(className, {
        'animate-spin': loading
      })}
      {...props}
    />
  );
});
Icon.displayName = 'Icon';
