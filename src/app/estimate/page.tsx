import { CostEstimator } from '@/components/estimate/CostEstimator';
import Image from 'next/image';

export default function EstimatePage() {
  return (
    <div className="relative container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Image
        src="https://picsum.photos/seed/ebikehero/1200/600"
        alt="E-bike rider in a park"
        fill
        className="object-cover absolute inset-0 z-0 opacity-10 dark:opacity-5"
        data-ai-hint="ebike park"
      />
      <div className="relative z-10 w-full">
         <CostEstimator />
      </div>
    </div>
  );
}
