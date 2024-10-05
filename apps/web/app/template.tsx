import { ErrorBoundary } from '@/components/error-boundary';

export default function Template({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
