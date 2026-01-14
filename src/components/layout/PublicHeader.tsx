'use client';

import Link from 'next/link';
import { Bike, Menu, CircleUser, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Skeleton } from '../ui/skeleton';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export function PublicHeader() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const adminRoleRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'roles_admin', user.uid) : null),
    [firestore, user]
  );
  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminRoleRef);
  const isUserAdmin = !!adminRole;


  const handleLogout = () => {
    auth.signOut().then(() => {
      router.push('/login');
    });
  };

  const renderUserMenu = () => {
    if (isUserLoading || (user && isAdminLoading)) {
      return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
             {isUserAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard" className='text-primary font-bold'>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14 flex items-center px-4 shrink-0">
        <div className="mr-4 flex items-center">
          <Link href="/estimate" className="mr-6 flex items-center space-x-2">
            <Bike className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              eBikeNow
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            {renderUserMenu()}
        </div>
    </header>
  );
}
