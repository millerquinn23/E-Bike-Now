import { bikes } from '@/lib/data';
import { BikeCard } from '@/components/bikes/BikeCard';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline tracking-tight mb-6">Available Bikes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bikes.map((bike) => (
          <BikeCard key={bike.bikeId} bike={bike} />
        ))}
      </div>
    </div>
  );
}
