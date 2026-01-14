import { bikes } from '@/lib/data';
import type { Bike } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statusVariantMap = {
  available: 'outline',
  rented: 'default',
  locked: 'destructive',
} as const;

export default function AdminBikesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bikes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bike ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Station</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bikes.map((bike: Bike) => (
              <TableRow key={bike.bikeId}>
                <TableCell className="font-medium">{bike.bikeId}</TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[bike.status] || 'secondary'} className="capitalize">
                    {bike.status}
                  </Badge>
                </TableCell>
                <TableCell>{bike.station}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
