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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function AdminRentalsPage() {
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
            {rentals.map((rental: Rental) => (
              <TableRow key={rental.rentalId}>
                <TableCell className="font-medium">{rental.rentalId}</TableCell>
                <TableCell>{rental.bikeId}</TableCell>
                <TableCell>{rental.userId}</TableCell>
                <TableCell>{format(rental.startTime, 'PPpp')}</TableCell>
                <TableCell>
                  {rental.endTime ? format(rental.endTime, 'PPpp') : 'In Progress'}
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
