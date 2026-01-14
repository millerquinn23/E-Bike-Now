'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { estimateRideCost, EstimateRideCostOutput } from '@/ai/flows/estimate-ride-cost';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Clock, Milestone, TrendingUp, CircleDollarSign, Lightbulb, Loader2 } from 'lucide-react';

const formSchema = z.object({
  rentalTimeMinutes: z.coerce.number().min(1, 'Rental time must be at least 1 minute.'),
  distanceMiles: z.coerce.number().min(0.1, 'Distance must be at least 0.1 miles.'),
  demandLevel: z.enum(['low', 'medium', 'high'], {
    required_error: 'You need to select a demand level.',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export function CostEstimator() {
  const [result, setResult] = useState<EstimateRideCostOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rentalTimeMinutes: 30,
      distanceMiles: 5,
      demandLevel: 'medium',
    },
  });

  async function onSubmit(values: FormSchema) {
    setIsSubmitting(true);
    setResult(null);
    try {
      const estimation = await estimateRideCost(values);
      setResult(estimation);
    } catch (error) {
      console.error('Failed to estimate cost:', error);
      // You could use the toast component here to show an error
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Estimate Your Ride</CardTitle>
        <CardDescription>Get an AI-powered cost estimate for your next e-bike adventure.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="rentalTimeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4 text-muted-foreground" />Rental Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distanceMiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Milestone className="mr-2 h-4 w-4 text-muted-foreground" />Distance (miles)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="demandLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center"><TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />Current Demand</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="low" />
                        </FormControl>
                        <FormLabel className="font-normal">Low</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal">Medium</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="high" />
                        </FormControl>
                        <FormLabel className="font-normal">High</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Estimating...
                </>
              ) : (
                'Estimate Cost'
              )}
            </Button>
            {result && (
              <Card className="mt-6 bg-secondary/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-headline">
                    <CircleDollarSign className="mr-3 h-8 w-8 text-primary" />
                    Estimated Cost: ${result.estimatedCost.toFixed(2)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start">
                    <Lightbulb className="mr-3 h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h4 className="font-semibold">Reasoning</h4>
                      <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
