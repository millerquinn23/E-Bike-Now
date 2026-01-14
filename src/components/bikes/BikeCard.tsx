'use client';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Bike } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type BikeCardProps = {
  bike: Bike & { id: string };
};

const statusVariantMap: Record<
  Bike['status'],
  'outline' | 'default' | 'destructive'
> = {
  available: 'outline',
  rented: 'default',
  locked: 'destructive',
};

// Use a simple hash function to pick an image based on bike ID
function selectImage(bikeId: string) {
  const bikeImages = PlaceHolderImages.filter(
    (img) => img.id.startsWith('ebike-') && img.id !== 'ebike-hero'
  );
  const hash = bikeId
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return bikeImages[hash % bikeImages.length] || bikeImages[0];
}

export function BikeCard({ bike }: BikeCardProps) {
  const image = selectImage(bike.id);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleRent = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'You must be logged in to rent a bike.',
      });
      router.push('/login');
      return;
    }
    if (!firestore) return;

    const rentalData = {
      bikeId: bike.id,
      userId: user.uid,
      startTime: serverTimestamp(),
      endTime: null,
      price: null,
    };

    try {
      const userRentalsRef = collection(firestore, 'users', user.uid, 'rentals');
      await addDocumentNonBlocking(userRentalsRef, rentalData);

      toast({
        title: 'Rental Started!',
        description: `You have rented ${bike.id}.`,
      });
      router.push('/rentals');
    } catch (error) {
       // Non-blocking functions handle their own errors via the emitter
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-lg">
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-lg">{bike.id}</CardTitle>
          <Badge
            variant={statusVariantMap[bike.status]}
            className="shrink-0 capitalize"
          >
            {bike.status}
          </Badge>
        </div>
        <CardDescription>{bike.station}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={bike.status !== 'available' || !user}
          onClick={handleRent}
        >
          Rent Now
        </Button>
      </CardFooter>
    </Card>
  );
}
