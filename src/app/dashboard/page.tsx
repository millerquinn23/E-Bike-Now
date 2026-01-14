'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Timer, CircleDollarSign, Lock, Play, Square } from 'lucide-react';
import { format } from 'date-fns';

export default function HomePage() {
  const [rideState, setRideState] = useState<'initial' | 'active' | 'locked'>(
    'initial'
  );
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [cost, setCost] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (rideState === 'active') {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rideState]);

  // Cost calculation effect
  useEffect(() => {
    if (rideState === 'active') {
      // Example cost: P10 base + P2 per minute
      const minutes = Math.floor(elapsedTime / 60);
      setCost(10 + minutes * 2);
    }
  }, [elapsedTime, rideState]);

  const handleStartRide = () => {
    setRideState('active');
    setStartTime(new Date());
    setElapsedTime(0);
    setCost(0);
  };

  const handleEndRide = () => {
    setRideState('initial');
    // In a real app, you would handle payment here
  };
  
  const handleToggleLock = () => {
    setRideState(prevState => prevState === 'locked' ? 'active' : 'locked');
  }

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-muted/20 p-4">
      {rideState === 'initial' ? (
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Ready for a ride?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="w-full" onClick={handleStartRide}>
              <Play className="mr-2" />
              Start Ride
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex h-full w-full max-w-sm flex-col justify-between">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-xl">
                Ride in Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Timer className="text-primary" />
                  <span>Duration</span>
                </div>
                <span className="font-mono text-lg font-semibold">
                  {formatDuration(elapsedTime)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <CircleDollarSign className="text-primary" />
                  <span>Current Cost</span>
                </div>
                <span className="font-mono text-lg font-semibold">
                  ${cost.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4">
            <Button
              variant={rideState === 'locked' ? 'secondary' : 'outline'}
              size="lg"
              onClick={handleToggleLock}
            >
              <Lock className="mr-2" />
              {rideState === 'locked' ? 'Unlock Ride' : 'Simulate Lock'}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndRide}
            >
              <Square className="mr-2" />
              End Ride &amp; Pay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
