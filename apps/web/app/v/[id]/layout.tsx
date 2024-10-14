export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10'>
      {children}
    </main>
  );
}
