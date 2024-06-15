'use client'; // top to the file

import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useContext, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import TextEditor from './textEditor';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { OrbitContext } from '@/lib/context/OrbitContext';

export const issueSchema = z.object({
  title: z.string(),
  contents: z.string(),
  statusid: z.number(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  assignee: z.array(z.string()),
});

export const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  contents: z.string(),
});

export function NewTemplate({ teamid, button, reload }: { teamid: string; button?: boolean; reload: Function }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      contents: '',
    },
  });
  const { fetcher } = useContext(OrbitContext);

  async function save(contents: string) {
    form.setValue('contents', contents);
  }

  async function submit(data: any) {
    const res = await fetcher(`/api/teams/${teamid}/templates/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast('Template created', {
        description: 'Template created successfully',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {button ? (
          <Button variant='outline' className='m-0 h-6 p-2 text-xs'>
            New Template
          </Button>
        ) : (
          <button>
            <PlusIcon className='h-4 w-4' />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className='flex h-[800px] max-h-full w-[750px] max-w-full flex-col overflow-hidden p-4  '>
        <DialogHeader className=' pt-2'>
          <DialogTitle>New Template</DialogTitle>
          <DialogDescription>Create a new template for issues</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='flex flex-grow flex-col space-y-8' onSubmit={form.handleSubmit((data) => submit(data))}>
            <div className='flex flex-col  gap-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='template title' {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='what is this template about?'
                        id='message-2'
                        className='h-20 resize-none'
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='contents'
              render={() => (
                <FormItem>
                  <TextEditor
                    content={form.getValues('contents')}
                    onUpdate={save}
                    className=' flex-grow overflow-hidden rounded-md border border-b-gray-100  p-1'
                  />
                </FormItem>
              )}
            />

            <div className='flex w-fit flex-row justify-end  gap-4 sm:w-full'>
              <Button type='submit' className='w-fit text-sm sm:w-full'>
                Create
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
