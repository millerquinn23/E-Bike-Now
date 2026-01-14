'use client';

import Link from 'next/link';
import { Bike, Menu, CircleUser, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
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

const navLinks = [
  { href: '/estimate', label: 'Estimate' },
  { href: '/dashboard', label: 'Bikes' },
];

export function PublicHeader() {
  const pathname = usePathname();
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
    auth.signOut();
    router.push('/login');
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
      <div className="hidden md:flex md:gap-2">
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
             {!user && (
                <div className="flex flex-col gap-2 p-4">
                    <Button asChild variant="default"><Link href="/login">Login</Link></Button>
                    <Button asChild variant="secondary"><Link href="/signup">Sign Up</Link></Button>
                </div>
            )}
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {renderUserMenu()}
        </div>
      </div>
    </header>
  );
}
