'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function useAuthEvent(event: { message: string }) {
  useEffect(() => {
    if (event) {
      toast(event.message);
    }
  }, [event]);
}
