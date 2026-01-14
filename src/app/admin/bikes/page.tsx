'use client';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
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
import { collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

const statusVariantMap = {
  available: 'outline',
  rented: 'default',
  locked: 'destructive',
} as const;

export default function AdminBikesPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const bikesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'bikes') : null),
    [firestore]
  );
  const { data: bikes } = useCollection<Bike>(bikesQuery);
  
  const handleEdit = (bikeId: string) => {
    router.push(`/admin/bikes/manage?id=${bikeId}`);
  }

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
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bikes?.map((bike: Bike) => (
              <TableRow key={bike.id}>
                <TableCell className="font-medium">{bike.id}</TableCell>
                <TableCell>
                  <Badge
                    variant={statusVariantMap[bike.status] || 'secondary'}
                    className="capitalize"
                  >
                    {bike.status}
                  </Badge>
                </TableCell>
                <TableCell>{bike.station}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(bike.id)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Bike</span>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
