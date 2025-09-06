import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, ...props }) => (
  <div className={cn('card', className)} {...props} />
);
export const CardHeader = ({ className, ...props }) => (
  <div className={cn('p-6 pb-0', className)} {...props} />
);
export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
);
export const CardDescription = ({ className, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);
export const CardContent = ({ className, ...props }) => (
  <div className={cn('p-6 pt-4', className)} {...props} />
);
export const CardFooter = ({ className, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);

// For ref compatibility
export const CardRef = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('card', className)} {...props} />
));
CardRef.displayName = 'CardRef';
