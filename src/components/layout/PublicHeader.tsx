'use client';

import Link from 'next/link';
import { Bike, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/estimate', label: 'Estimate' },
  { href: '/dashboard', label: 'Bikes' },
];

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/estimate" className="mr-6 flex items-center space-x-2">
            <Bike className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              eBikeNow
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/estimate" className="mr-6 flex items-center space-x-2">
              <Bike className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">
                eBikeNow
              </span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'transition-colors hover:text-foreground/80',
                      pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4">
                <Button asChild variant="default"><Link href="/login">Login</Link></Button>
                <Button asChild variant="secondary"><Link href="/signup">Sign Up</Link></Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="hidden md:flex md:gap-2">
            <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
            <Button asChild><Link href="/signup">Sign Up</Link></Button>
          </div>
        </div>
      </div>
    </header>
  );
}
