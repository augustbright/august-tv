import { Guard, RedirectHome } from '@/components/guard';
import { LayoutWithSidebar } from '@/components/layout-with-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Guard
      error={RedirectHome}
      fallback={<RedirectHome />}
    >
      <LayoutWithSidebar
        sidebarHeader='Profile'
        sidebarItems={[
          { name: 'General', href: '/profile/general', segment: 'general' },
          {
            name: 'My Videos',
            href: '/profile/my-videos',
            segment: 'my-videos'
          }
        ]}
      >
        {children}
      </LayoutWithSidebar>
    </Guard>
  );
}
