import { getApiClient } from '@/api/client';
import { getQueryClient } from '@/api/queryClient';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { inRange } from 'lodash';

import { Providers } from '../components/Providers';
import { AppHeader } from './_app-header/app-header';
import './global.css';

export const metadata = {
  title: 'SWARM',
  description: 'Join the Swarm!'
};

const getHealth = async () => {
  try {
    const apiClient = await getApiClient();
    const { status } = await apiClient.get('/health');
    const isHealthy = inRange(status, 200, 300);
    return isHealthy;
  } catch {
    return false;
  }
};

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const isHealthy = await getHealth();

  return (
    <html lang='en'>
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {isHealthy ? (
              <div className='flex flex-col'>
                <AppHeader />
                <div>{children}</div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-screen gap-4'>
                <div className='text-3xl text-gray-500'>
                  The server is not healthy 😵
                </div>
                <div className='text-sm text-gray-500'>
                  Let&apos;s hope it gets better soon!
                </div>
              </div>
            )}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
