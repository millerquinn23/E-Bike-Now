import { CostEstimator } from '@/components/estimate/CostEstimator';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function EstimatePage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'ebike-hero');

  return (
    <div className="relative container flex items-center justify-center py-8 h-full">
      {heroImage && (
        <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover absolute inset-0 z-0 opacity-10 dark:opacity-5"
            data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="relative z-10 w-full px-4">
         <CostEstimator />
      </div>
    </div>
  );
}
