import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  DefaultError,
  DefinedQueryObserverResult,
  QueryKey,
  QueryObserverLoadingErrorResult,
  QueryObserverLoadingResult,
  UndefinedInitialDataOptions,
  useQuery
} from '@tanstack/react-query';

import { AlertCircle, CircleHelp, Loader2 } from 'lucide-react';

import { ErrorBoundary } from './error-boundary';

type TQueryLoadingChildren<
  TError = DefaultError,
  TData = unknown
> = React.ComponentType<{ result: QueryObserverLoadingResult<TData, TError> }>;

type TQueryErrorChildren<
  TError = DefaultError,
  TData = unknown
> = React.ComponentType<{
  result: QueryObserverLoadingErrorResult<TData, TError>;
}>;

type TQueryDataChild<TData = unknown, TError = DefaultError> = (
  result: DefinedQueryObserverResult<TData, TError>
) => React.ReactNode;

export type TQueryChildrenProps<TData> = {
  loading?: TQueryLoadingChildren<DefaultError, TData>;
  error?: TQueryErrorChildren<DefaultError, TData>;
};

const LOADING = {
  ICON: () => (
    <div className='flex justify-center w-full'>
      <Loader2 className='animate-spin' />
    </div>
  ),
  ROW: () => (
    <div className='flex justify-center p-6 w-full'>
      <Loader2 className='animate-spin' />
    </div>
  ),
  NONE: () => null
} satisfies Record<string, TQueryLoadingChildren>;

const ERROR = {
  TEXT: ({ result }) => (
    <Tooltip>
      <TooltipTrigger>
        <p className='text-destructive flex gap-2 items-center'>
          <span>Something went wrong</span>
          <CircleHelp className='w-4 h-4' />
        </p>
      </TooltipTrigger>
      <TooltipContent>
        <p>Error: {result.error.message}</p>
      </TooltipContent>
    </Tooltip>
  ),
  ALERT: ({ result }) => (
    <Alert variant='destructive'>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{result.error.message}</AlertDescription>
    </Alert>
  )
} satisfies Record<string, TQueryErrorChildren<DefaultError>>;

export const Query = <
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>({
  query,
  loading: LoadingComponent = LOADING.ICON,
  error: ErrorComponent = ERROR.TEXT,
  children
}: {
  query: UndefinedInitialDataOptions<
    TQueryFnData,
    DefaultError,
    TData,
    TQueryKey
  >;
  children: TQueryDataChild<TData, DefaultError>;
} & TQueryChildrenProps<TData>) => {
  const result = useQuery(query);

  if (result.isLoading) {
    return (
      <LoadingComponent
        result={result as QueryObserverLoadingResult<TData, DefaultError>}
      />
    );
  }

  if (result.error) {
    return (
      <ErrorComponent
        result={result as QueryObserverLoadingErrorResult<TData, DefaultError>}
      />
    );
  }

  if (result.isSuccess || result.isRefetchError) {
    return (
      <ErrorBoundary>
        {children(result as DefinedQueryObserverResult<TData, DefaultError>)}
      </ErrorBoundary>
    );
  }

  return null;
};

Query.ERROR = ERROR;
Query.LOADING = LOADING;
