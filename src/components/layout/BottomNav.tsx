'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calculator, User, MessageCircle, History } from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavLinks = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/estimate', label: 'Estimate', icon: Calculator },
  { href: '/rentals', label: 'Rentals', icon: History },
  { href: '/chatbot', label: 'Chatbot', icon: MessageCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 z-50 w-full h-20 bg-background border-t shrink-0">
      <div className="grid h-full grid-cols-4 mx-auto font-medium">
        {mainNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group pt-2 pb-1',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <link.icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{link.label}</span>
              </Link>
            )
        })}
      </div>
    </div>
  );
}
