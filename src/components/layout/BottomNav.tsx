'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, History, User, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';

const mainNavLinks = [
  { href: '/dashboard', label: 'Bikes', icon: Home },
  { href: '/rentals', label: 'My Rentals', icon: History },
  { href: '/estimate', label: 'Estimate', icon: Calculator },
  { href: '/account', label: 'Account', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  
  return (
    <div className="sticky bottom-0 z-50 w-full h-20 bg-background border-t shrink-0">
      <div className="grid h-full grid-cols-4 mx-auto font-medium">
        {mainNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group pt-2 pb-1',
              pathname.startsWith(link.href)
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <link.icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
