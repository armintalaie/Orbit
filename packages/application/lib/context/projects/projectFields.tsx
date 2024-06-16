import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function useProjectTitleField({ defaultValue }: { defaultValue?: string }) {
  const schema = z.object({
    name: z.string().min(3),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValue || '',
    },
  });

  return {
    form,
  };
}
