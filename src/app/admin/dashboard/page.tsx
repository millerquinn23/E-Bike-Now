import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { users, bikes, rentals } from '@/lib/data';
import { Bike, Users, History, CircleDollarSign } from 'lucide-react';

export default function AdminDashboardPage() {
  const totalUsers = users.length;
  const totalBikes = bikes.length;
  const availableBikes = bikes.filter((b) => b.status === 'available').length;
  const totalRentals = rentals.length;
  const totalRevenue = rentals.reduce((acc, r) => acc + (r.price || 0), 0);

  const stats = [
    { title: 'Total Users', value: totalUsers, icon: Users },
    { title: 'Available Bikes', value: `${availableBikes} / ${totalBikes}`, icon: Bike },
    { title: 'Total Rentals', value: totalRentals, icon: History },
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: CircleDollarSign },
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
