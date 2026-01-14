import { BottomNav } from './BottomNav';
import { AppHeader } from './AppHeader';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
      <div className="relative w-full max-w-[400px] aspect-[9/19.5] flex flex-col rounded-[2.5rem] border-8 border-neutral-800 dark:border-neutral-700 bg-background shadow-2xl overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
