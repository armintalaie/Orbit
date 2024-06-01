'use client';

import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useContext, useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '../../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DeadlineField } from '../fields/deadlineField';
import { StatusField } from '../fields/statusField';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { gql, useMutation } from '@apollo/client';

const NEW_PROJECT = gql`
  mutation CreateProject($workspaceId: String!, $project: NewProjectInput!) {
    createProject(workspaceId: $workspaceId, project: $project) {
      id
      name
      description
      status {
        id
        name
      }
      targetDate
      startDate
    }
  }
`;

export const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  statusid: z.any().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export function NewProject({
  defaultValues,
  button,
}: {
  button?: boolean;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
}) {
  const { currentWorkspace } = useContext(OrbitContext);
  const [open, setOpen] = useState(false);
  const [createProject, { data, loading, error }] = useMutation(NEW_PROJECT);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      ...defaultValues,
    },
  });

  async function onSubmit() {
    const formVals = form.getValues();
    const project = {
      name: formVals.name,
      // statusid: formVals.statusid,
    };
    console.log(project);

    createProject({ variables: { workspaceId: currentWorkspace, project: project } });
  }

  console.log(data);
  console.log(loading);
  console.log(error);
  useEffect(() => {
    if (data) {
      form.reset();
    }
  }, [data]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        {button ? (
          <Button variant='outline' className='m-0 h-6 p-2 text-xs font-normal'>
            New Project
          </Button>
        ) : (
          <button>
            <PlusIcon className='h-4 w-4' />
          </button>
        )}
      </SheetTrigger>
      <SheetContent className='w-full flex-1 '>
        <SheetHeader>
          <SheetTitle>New Project</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex h-full w-full flex-1 flex-col gap-1 space-y-4 overflow-hidden px-2 py-4   '
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='next big thing' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='some details about this grand idea' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex w-full flex-col items-center gap-4 space-x-2 border-y py-8'>
              {/* <FormField
                control={form.control}
                name='statusid'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Status</FormLabel>
                    <FormControl className='w-full'>
                      <StatusField {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/*<FormField*/}
              {/*  control={form.control}*/}
              {/*  name='startDate'*/}
              {/*  render={({ field }) => (*/}
              {/*    <FormItem className='w-full'>*/}
              {/*      <FormLabel>Start Date</FormLabel>*/}
              {/*      <FormControl className='w-full'>*/}
              {/*        <DeadlineField field={field} />*/}
              {/*      </FormControl>*/}
              {/*      <FormMessage />*/}
              {/*    </FormItem>*/}
              {/*  )}*/}
              {/*/>*/}

              {/*<FormField*/}
              {/*  control={form.control}*/}
              {/*  name='targetDate'*/}
              {/*  render={({ field }) => (*/}
              {/*    <FormItem className='w-full'>*/}
              {/*      <FormLabel>Target Date</FormLabel>*/}
              {/*      <FormControl className='w-full'>*/}
              {/*        <DeadlineField field={field} />*/}
              {/*      </FormControl>*/}
              {/*      <FormMessage />*/}
              {/*    </FormItem>*/}
              {/*  )}*/}
              {/*/>*/}
            </div>

            <div className='flex w-full flex-1 flex-col items-end justify-end '>
              <Button type='submit' className='w-full'>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
