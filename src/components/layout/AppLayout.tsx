import { BottomNav } from './BottomNav';
import { AppHeader } from './AppHeader';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-muted/40">
      <div className="relative flex min-h-screen w-full max-w-lg flex-col border-x bg-background shadow-lg">
        <AppHeader />
        <main className="flex-1 pb-20">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
