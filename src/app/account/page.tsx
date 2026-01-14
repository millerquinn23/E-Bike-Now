'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user || !firestore) return;

    setIsSaving(true);

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: name });

      // Update Firestore document (non-blocking)
      const userRef = doc(firestore, 'users', user.uid);
      updateDocumentNonBlocking(userRef, { name });

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not update your profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading) {
    return (
      <Card className="m-0 border-0 shadow-none rounded-none">
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="m-0 border-0 shadow-none rounded-none">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Profile</CardTitle>
        <CardDescription>
          Manage your account settings and personal information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} disabled />
          <p className="text-xs text-muted-foreground">
            Email address cannot be changed.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
