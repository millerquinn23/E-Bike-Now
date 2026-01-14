'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useDoc, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Bike } from '@/lib/types';

const formSchema = z.object({
  id: z.string().min(1, 'Bike ID is required.'),
  station: z.string().min(1, 'Station is required.'),
  status: z.enum(['available', 'rented', 'locked']),
});

type FormSchema = z.infer<typeof formSchema>;

export default function ManageBikePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const bikeId = searchParams.get('id');
  const isEditing = !!bikeId;

  const bikeRef = isEditing && firestore ? doc(firestore, 'bikes', bikeId) : null;
  const { data: bike, isLoading: isLoadingBike } = useDoc<Bike>(bikeRef);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      station: '',
      status: 'available',
    },
  });

  useEffect(() => {
    if (isEditing && bike) {
      form.reset(bike);
    }
    if(bikeId) {
        form.setValue('id', bikeId);
    }
  }, [bike, isEditing, form, bikeId]);

  const onSubmit = async (values: FormSchema) => {
    if (!firestore) return;

    const docRef = doc(firestore, 'bikes', values.id);
    setDocumentNonBlocking(docRef, values, { merge: isEditing });

    toast({
      title: isEditing ? 'Bike Updated' : 'Bike Created',
      description: `Bike ${values.id} has been saved.`,
    });
    router.push('/admin/bikes');
  };

  const { isSubmitting } = form.formState;

  if (isEditing && isLoadingBike) {
    return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {isEditing ? `Edit Bike: ${bikeId}` : 'Add New Bike'}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update the details for this bike.'
            : 'Fill in the details to add a new bike to the fleet.'}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bike ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., bike-001" {...field} disabled={isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="station"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Central Park" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? 'Save Changes' : 'Create Bike'}
                </Button>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
