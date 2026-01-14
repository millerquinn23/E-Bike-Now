'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bike, Users, History, CircleDollarSign } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { User, Bike as BikeType, Rental } from '@/lib/types';

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const usersQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  const bikesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'bikes') : null),
    [firestore]
  );
  const rentalsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'rentals') : null),
    [firestore]
  );

  const { data: users } = useCollection<User>(usersQuery);
  const { data: bikes } = useCollection<BikeType>(bikesQuery);
  const { data: rentals } = useCollection<Rental>(rentalsQuery);

  const totalUsers = users?.length || 0;
  const totalBikes = bikes?.length || 0;
  const availableBikes =
    bikes?.filter((b) => b.status === 'available').length || 0;
  const totalRentals = rentals?.length || 0;
  const totalRevenue =
    rentals?.reduce((acc, r) => acc + (r.price || 0), 0) || 0;

  const stats = [
    { title: 'Total Users', value: totalUsers, icon: Users },
    {
      title: 'Available Bikes',
      value: `${availableBikes} / ${totalBikes}`,
      icon: Bike,
    },
    { title: 'Total Rentals', value: totalRentals, icon: History },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
