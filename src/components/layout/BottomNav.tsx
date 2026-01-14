'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, User, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';

const mainNavLinks = [
  { href: '/dashboard', label: 'Bikes', icon: Home },
  { href: '/rentals', label: 'My Rentals', icon: History },
  { href: '/account', label: 'Account', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();

  const adminRoleRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'roles_admin', user.uid) : null),
    [firestore, user]
  );
  const { data: adminRole } = useDoc(adminRoleRef);
  const isUserAdmin = !!adminRole;

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="inline-flex flex-col items-center justify-center px-5 h-full rounded-none group text-muted-foreground">
                <LogOut className="w-5 h-5 mb-1" />
                <span className="text-sm">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="mb-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isUserAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard" className="text-primary font-bold">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
                <Link href="/estimate">Estimate Cost</Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
