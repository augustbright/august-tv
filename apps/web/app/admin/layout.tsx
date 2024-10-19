import { Guard, RedirectHome } from '@/components/guard';
import { LayoutWithSidebar } from '@/components/layout-with-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Guard
      roles={['ADMIN']}
      error={RedirectHome}
      fallback={<RedirectHome />}
    >
      <LayoutWithSidebar
        sidebarHeader='Admin tools'
        sidebarItems={[
          { name: 'Dashboard', href: '/admin/dashboard', segment: 'dashboard' },
          {
            name: 'Import from Youtube',
            href: '/admin/youtube',
            segment: 'youtube'
          },
          { name: 'Job Test', href: '/admin/test-job', segment: 'test-job' }
        ]}
      >
        {children}
      </LayoutWithSidebar>
    </Guard>
  );
}
