import { HomeAside } from './_home_aside';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-8'>
      <div className='flex'>
        <HomeAside />
        <div className='px-4 grow'>{children}</div>
      </div>
    </div>
  );
}
