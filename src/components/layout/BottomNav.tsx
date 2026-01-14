'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, History, User, LogOut, Shield, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';

const mainNavLinks = [
  { href: '/dashboard', label: 'Bikes', icon: Home },
  { href: '/rentals', label: 'My Rentals', icon: History },
  { href: '/estimate', label: 'Estimate', icon: Calculator },
  { href: '/account', label: 'Account', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();


  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm h-16 bg-background border-t rounded-b-2xl">
      <div className="grid h-full grid-cols-4 mx-auto font-medium">
        {mainNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group',
              pathname.startsWith(link.href)
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <link.icon className="w-5 h-5 mb-1" />
            <span className="text-sm">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
