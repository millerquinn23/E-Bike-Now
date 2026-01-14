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
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type BikeCardProps = {
  bike: Bike;
};

const statusVariantMap: Record<Bike['status'], 'outline' | 'default' | 'destructive'> = {
  available: 'outline',
  rented: 'default',
  locked: 'destructive',
};

// Use a simple hash function to pick an image based on bike ID
function selectImage(bikeId: string) {
    const bikeImages = PlaceHolderImages.filter(img => img.id.startsWith('ebike-') && img.id !== 'ebike-hero');
    const hash = bikeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return bikeImages[hash % bikeImages.length] || bikeImages[0];
}

export function BikeCard({ bike }: BikeCardProps) {
  const image = selectImage(bike.bikeId);
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
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-headline">{bike.bikeId}</CardTitle>
            <Badge variant={statusVariantMap[bike.status]} className="capitalize shrink-0">
                {bike.status}
            </Badge>
        </div>
        <CardDescription>{bike.station}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={bike.status !== 'available'}>
          Rent Now
        </Button>
      </CardFooter>
    </Card>
  );
}
