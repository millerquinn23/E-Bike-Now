import { BottomNav } from './BottomNav';
import { AppHeader } from './AppHeader';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-muted/40 p-4">
      <div className="relative flex min-h-[calc(100vh-2rem)] w-full max-w-sm flex-col rounded-2xl border-4 border-black bg-background shadow-2xl">
        <AppHeader />
        <main className="flex-1 pb-20">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
