'use client';
import { BikeCard } from '@/components/bikes/BikeCard';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Bike } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const firestore = useFirestore();

  const bikesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'bikes'), where('status', '==', 'available'))
        : null,
    [firestore]
  );
  const { data: bikes, isLoading } = useCollection<Bike>(bikesQuery);

  return (
    <div>
      <h1 className="mb-4 font-headline text-2xl tracking-tight px-4 pt-4">
        Available Bikes
      </h1>
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
      )}
      {bikes && bikes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-4">
          {bikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      ) : (
        !isLoading && <p className="px-4">No bikes available at the moment.</p>
      )}
    </div>
  );
}
