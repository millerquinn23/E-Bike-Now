'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Timer,
  CircleDollarSign,
  Lock,
  Play,
  Square,
  Bike as BikeIcon,
  Loader2,
} from 'lucide-react';
import {
  useFirestore,
  useUser,
  useCollection,
  useMemoFirebase,
  updateDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase';
import {
  collection,
  query,
  where,
  limit,
  doc,
  serverTimestamp,
  Timestamp,
  getDocs,
} from 'firebase/firestore';
import type { Rental, Bike } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isActionLoading, setIsActionLoading] = useState(false);

  // Find the user's active rental
  const activeRentalQuery = useMemoFirebase(
    () =>
      firestore && user
        ? query(
            collection(firestore, 'users', user.uid, 'rentals'),
            where('endTime', '==', null),
            limit(1)
          )
        : null,
    [firestore, user]
  );
  const {
    data: activeRentals,
    isLoading: isLoadingRental,
  } = useCollection<Rental>(activeRentalQuery);
  const activeRental = activeRentals?.[0];

  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [cost, setCost] = useState(0);

  // Timer and cost calculation effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (activeRental?.startTime) {
      const calculateElapsedTime = () => {
        const now = new Date();
        const start = activeRental.startTime.toDate();
        const seconds = Math.floor((now.getTime() - start.getTime()) / 1000);
        setElapsedTime(seconds);
        // Example cost: P10 base + P2 per minute
        const minutes = Math.floor(seconds / 60);
        setCost(10 + minutes * 2);
      };

      calculateElapsedTime(); // Initial calculation
      interval = setInterval(calculateElapsedTime, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeRental]);

  const handleStartRide = async () => {
    if (!firestore || !user) return;
    setIsActionLoading(true);

    try {
      // 1. Find an available bike
      const availableBikesQuery = query(
        collection(firestore, 'bikes'),
        where('status', '==', 'available'),
        limit(1)
      );
      const availableBikesSnapshot = await getDocs(availableBikesQuery);
      if (availableBikesSnapshot.empty) {
        toast({
          variant: 'destructive',
          title: 'No Bikes Available',
          description: 'Sorry, all bikes are currently in use.',
        });
        setIsActionLoading(false);
        return;
      }
      const bikeToRent = availableBikesSnapshot.docs[0].data() as Bike;

      // 2. Create the rental document
      const rentalData = {
        userId: user.uid,
        bikeId: bikeToRent.id,
        startTime: serverTimestamp(),
        endTime: null,
        price: null,
      };

      // Create in master collection (non-blocking)
      const rentalRef = doc(collection(firestore, 'rentals'));
      setDocumentNonBlocking(rentalRef, { ...rentalData, id: rentalRef.id }, { merge: false });

      // Create in user's sub-collection (non-blocking)
      const userRentalRef = doc(firestore, 'users', user.uid, 'rentals', rentalRef.id);
      setDocumentNonBlocking(userRentalRef, { ...rentalData, id: rentalRef.id }, { merge: false });


      // 3. Update the bike's status to 'rented'
      const bikeRef = doc(firestore, 'bikes', bikeToRent.id);
      updateDocumentNonBlocking(bikeRef, { status: 'rented' });

      toast({
        title: 'Ride Started!',
        description: `You are now renting bike ${bikeToRent.id}.`,
      });
    } catch (error) {
      console.error('Error starting ride:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not start your ride. Please try again.',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEndRide = async () => {
    if (!firestore || !user || !activeRental) return;
    setIsActionLoading(true);

    try {
      const finalCost = cost;
      const endTime = serverTimestamp();

      // Update master rental document
      const rentalRef = doc(firestore, 'rentals', activeRental.id);
      updateDocumentNonBlocking(rentalRef, { endTime, price: finalCost });

      // Update user's rental document
      const userRentalRef = doc(
        firestore,
        'users',
        user.uid,
        'rentals',
        activeRental.id
      );
      updateDocumentNonBlocking(userRentalRef, { endTime, price: finalCost });

      // Update bike status
      const bikeRef = doc(firestore, 'bikes', activeRental.bikeId);
      updateDocumentNonBlocking(bikeRef, { status: 'available' });

      toast({
        title: 'Ride Ended',
        description: `Your ride has ended. Total cost: $${finalCost.toFixed(
          2
        )}`,
      });
    } catch (error) {
      console.error('Error ending ride:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not end your ride. Please try again.',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleLock = () => {
    // This is purely a UI simulation and doesn't affect the backend state in this version.
    // In a real app, you would update the bike's status to 'locked'.
    toast({
      title: 'Lock Toggled (Simulation)',
      description: 'In a real app, this would lock/unlock the bike.',
    });
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (isUserLoading || isLoadingRental) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-muted/20 p-4">
      {!activeRental ? (
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Ready for a ride?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <BikeIcon className="w-24 h-24 text-primary/80" />
            <Button
              size="lg"
              className="w-full"
              onClick={handleStartRide}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <Play className="mr-2" />
              )}
              Start Ride
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex h-full w-full max-w-sm flex-col justify-between">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-xl">
                Ride in Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm text-muted-foreground text-center">Bike ID: {activeRental.bikeId}</p>
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Timer className="text-primary" />
                  <span>Duration</span>
                </div>
                <span className="font-mono text-lg font-semibold">
                  {formatDuration(elapsedTime)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <CircleDollarSign className="text-primary" />
                  <span>Current Cost</span>
                </div>
                <span className="font-mono text-lg font-semibold">
                  ${cost.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4">
            <Button
              variant='outline'
              size="lg"
              onClick={handleToggleLock}
            >
              <Lock className="mr-2" />
              Simulate Lock
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndRide}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <Square className="mr-2" />
              )}
              End Ride &amp; Pay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
