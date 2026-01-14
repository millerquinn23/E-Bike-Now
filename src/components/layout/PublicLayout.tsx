import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
      <div className="relative w-full max-w-[400px] aspect-[9/19.5] flex flex-col rounded-[2.5rem] border-8 border-neutral-800 dark:border-neutral-700 bg-background shadow-2xl overflow-hidden">
        <PublicHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
