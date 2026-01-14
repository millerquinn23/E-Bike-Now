import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-muted/40">
      <div className="relative flex min-h-screen w-full max-w-lg flex-col border-x bg-background shadow-lg">
        <PublicHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
