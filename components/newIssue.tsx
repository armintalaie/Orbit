"use client"; // top to the file

import { PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DeadlineField } from "./issues/form/deadlineField";
import { AssigneeField } from "./issues/form/assigneeField";
import { StatusField } from "./issues/form/statusField";
import { Textarea } from "@/components/ui/textarea"


 
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function NewIssue({button}: {button?: boolean}) {
    const { toast } = useToast()
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
        status: "",
      },
    })
    async function onSubmit(e) {
        console.log(e);
        e.preventDefault();
        const title = e.target.elements.title.value;
  const description = e.target.elements.description.value;
  const status = e.target.elements.status.value;
  const assignee = e.target.elements.assignee.value;
  const deadline = e.target.elements.deadline.value;
  

        const data = {
            title,
            description,
            status,
            assignee,
            deadline
        };
       const rest= await fetch('/api/projects/1/issues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await rest.json();
        setOpen(false);

        
        toast({
            title: 'Issue created',
            description: result.message,
          
        })

    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {button ? <Button variant="outline" className="p-2 text-xs m-0 h-6">New Issue</Button> :  <button>
            <PlusIcon className="h-4 w-4" />
        </button>}
       
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>New Issue</DialogTitle>
          <DialogDescription>
           Create a new issue
          </DialogDescription>
        </DialogHeader>
       

        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
              <Textarea placeholder="Type your message here." id="message-2" className="h-60" />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row space-x-4">

<FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
             

              <StatusField />
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
              <FormLabel>Priority</FormLabel>
              <FormControl>
              <Select>
  <SelectTrigger className="w-[100px]">
    <SelectValue placeholder="none" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
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
              <FormLabel>Deadline</FormLabel>
              <FormControl>
              <DeadlineField/>
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
       
</div>

<FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <FormControl>
           <AssigneeField/>
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />


        <Button type="submit">Submit</Button>
      </form>
    </Form>


        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
           
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

