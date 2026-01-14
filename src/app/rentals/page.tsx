import { rentals } from '@/lib/data';
import type { Rental } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function RentalsPage() {
  // In a real app, this would be filtered for the current user
  const userRentals = rentals;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">My Rentals</CardTitle>
        <CardDescription>A history of your e-bike journeys.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rental ID</TableHead>
              <TableHead>Bike ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userRentals.length > 0 ? (
                userRentals.map((rental: Rental) => (
                    <TableRow key={rental.rentalId}>
                        <TableCell className="font-medium">{rental.rentalId}</TableCell>
                        <TableCell>{rental.bikeId}</TableCell>
                        <TableCell>{format(rental.startTime, 'PP')}</TableCell>
                        <TableCell className="text-right">
                        {rental.price != null ? `$${rental.price.toFixed(2)}` : 'In Progress'}
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
