import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function useIssueStatusField({ defaultValue }: { defaultValue?: string }) {
  const { workspace } = useContext(OrbitContext);
  const statuses = workspace.config.issueStatus;
  const schema = z.object({
    statusId: z
      .union([z.string(), z.number()])
      .refine((statusId) => statuses.some((status) => status.id === statusId), {
        message: 'Invalid status',
      }),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    // mode: "onChange",
    defaultValues: {
      statusId: defaultValue ?? statuses[0].id,
    },
  });

  return {
    form,
    statuses,
  };
}

export function useIssueTitleField({ defaultValue }: { defaultValue?: string }) {
  const schema = z.object({
    title: z.string().min(3),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValue || '',
    },
  });

  return {
    form,
  };
}

export function useIssueTargetDateField({ defaultValue }: { defaultValue?: string }) {
  const schema = z.object({
    targetDate: z.string().nullable(),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      targetDate: defaultValue || null,
    },
  });

  return {
    form,
  };
}
