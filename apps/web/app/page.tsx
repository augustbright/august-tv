import { Feed } from './_feed/feed';

export default function Index() {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <Feed />
    </main>
  );
}
