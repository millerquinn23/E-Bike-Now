'use client';

import { useRouter } from 'next/navigation';
import { Bike, CircleUser, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import type { Admin } from '@/lib/types';

export function AppHeader() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const adminRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'roles_admin', user.uid) : null),
    [user, firestore]
  );
  const { data: admin } = useDoc<Admin>(adminRef);
  const isAdmin = !!admin;

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.push('/login');
    });
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 shrink-0">
      <div className="flex items-center gap-2">
        <Bike className="h-6 w-6 text-primary" />
        <span className="font-headline text-lg font-semibold">eBikeNow</span>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial" />
        {isUserLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">Admin Panel</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/account">Profile</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/rentals">My Rentals</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}
