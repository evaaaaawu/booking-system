'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import dayjs from 'dayjs';
import type { User as PrismaUser, EventType as PrismaEventType } from '@prisma/client';
import { Button } from '@repo/ui/button';
import { Spinner } from '@repo/ui/spinner';

interface BookingFormProps {
  user: Partial<PrismaUser>;
  eventType: Partial<PrismaEventType>;
}

export default function BookingForm({ user, eventType }: BookingFormProps): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams?.get('date') || '';

  const [loading, setLoading] = useState(false);

  const bookingHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      start: dayjs(date).format(),
      end: dayjs(date).add(eventType.length!, 'minute').format(),
      name: formData.get('name'),
      email: formData.get('email'),
      notes: formData.get('notes'),
    };

    try {
      const res = await fetch(`/api/book/${user.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push(
          `/success?date=${encodeURIComponent(
            date
          )}&type=${eventType.id}&user=${encodeURIComponent(user.username!)}`
        );
      } else {
        console.error('Booking failed');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={bookingHandler}>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Your name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="John Doe"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            type="email"
            name="email"
            id="email"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Additional notes
        </label>
        <textarea
          name="notes"
          id="notes"
          rows={3}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Please share anything that will help prepare for our meeting."
        ></textarea>
      </div>
      <div>
        <Button
          variant="primary"
          size="lg"
          isSubmit={true}
          disabled={loading}
        >
          {loading ? <Spinner /> : 'Confirm'}
        </Button>
        <Link href={`/${user.username}/${eventType.id}`} className="ml-2 btn btn-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}
