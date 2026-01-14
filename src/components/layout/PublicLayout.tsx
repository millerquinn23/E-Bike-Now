import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-muted/40 p-4">
      <div className="relative flex min-h-[calc(100vh-2rem)] w-full max-w-sm flex-col rounded-2xl border-neutral-300 dark:border-neutral-700 border-8 bg-background shadow-2xl">
        <PublicHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
