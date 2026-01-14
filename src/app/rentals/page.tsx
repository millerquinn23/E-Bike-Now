'use client';
import {
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
} from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Rental } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function RentalsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const rentalsQuery = useMemoFirebase(
    () =>
      firestore && user
        ? collection(firestore, 'users', user.uid, 'rentals')
        : null,
    [firestore, user]
  );
  const { data: userRentals, isLoading } = useCollection<Rental>(rentalsQuery);

  const calculateCost = (startTime: Date, endTime: Date | null) => {
    if (!endTime) return 'In Progress';
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    if (durationHours <= 1) {
      return 'P120.00';
    }

    const extraHours = Math.ceil(durationHours - 1);
    const cost = 120 + extraHours * 50;
    return `P${cost.toFixed(2)}`;
  };

  const isLoadingData = isUserLoading || isLoading;

  return (
    <Card className="m-0 border-0 shadow-none rounded-none">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Rentals</CardTitle>
        <CardDescription>A history of your e-bike journeys.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Bike</TableHead>
              <TableHead className="px-4">End Time</TableHead>
              <TableHead className="text-right px-4">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingData ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-4">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="px-4">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right px-4">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : userRentals && userRentals.length > 0 ? (
              userRentals.map((rental: Rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium px-4">{rental.bikeId}</TableCell>
                  <TableCell className="px-4">
                    {rental.endTime
                      ? format(rental.endTime.toDate(), 'P')
                      : 'In Progress'}
                  </TableCell>
                  <TableCell className="text-right px-4">
                    {calculateCost(
                      rental.startTime.toDate(),
                      rental.endTime ? rental.endTime.toDate() : null
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  You have no rental history yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
