'use client';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
import type { Rental } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { collection } from 'firebase/firestore';

export default function AdminRentalsPage() {
  const firestore = useFirestore();
  const rentalsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'rentals') : null),
    [firestore]
  );
  const { data: rentals } = useCollection<Rental>(rentalsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rentals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rental ID</TableHead>
              <TableHead>Bike ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals?.map((rental: Rental) => (
              <TableRow key={rental.id}>
                <TableCell className="font-medium">{rental.id}</TableCell>
                <TableCell>{rental.bikeId}</TableCell>
                <TableCell>{rental.userId}</TableCell>
                <TableCell>
                  {rental.startTime && format(rental.startTime.toDate(), 'PPpp')}
                </TableCell>
                <TableCell>
                  {rental.endTime
                    ? format(rental.endTime.toDate(), 'PPpp')
                    : 'In Progress'}
                </TableCell>
                <TableCell className="text-right">
                  {rental.price != null ? `$${rental.price.toFixed(2)}` : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
