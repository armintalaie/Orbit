import { statusIconMapper } from '@/components/statusIconMapper';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { STATUS } from '@/lib/util';
import { useState } from 'react';
import { toast } from 'sonner';

type IssueStatusFieldProps = {
  statusId: number;
  issueId: number;
};

export default function IssueStatusField({
  statusId,
  issueId,
}: IssueStatusFieldProps) {
  const statusOptions = STATUS || [];
  const [selectedStatusId, setSelectedStatusId] = useState<number>(statusId);
  const [open, setOpen] = useState(false);

  async function updateStatus(id: number) {
    const res = await fetch(`/api/issues/${issueId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        statusid: id,
      }),
    });

    if (!res.ok) throw new Error(res.statusText);

    toast('status updated');
  }

  function filter(value: string, search: string) {
    try {
      if (!value || !statusOptions[Number(value)]) {
        return 0;
      }
      return statusOptions[Number(value)].label
        .toLowerCase()
        .indexOf(search.toLowerCase()) !== -1
        ? 1
        : 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  const onSelectedStatusChange = (value: string) => {
    const selectedIdChanged = Number(value);
    const foundId = Object.keys(statusOptions).find((m) => m === value);
    if (!foundId) {
      return;
    }
    setSelectedStatusId(Number(foundId));
    updateStatus(Number(foundId));
  };

  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='w-full justify-start p-0'>
            <div className='flex items-center space-x-2 text-xs'>
              {statusIconMapper(
                statusOptions[selectedStatusId].label,
                'h-4 w-4'
              )}
              <span>{statusOptions[selectedStatusId].label}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='right' align='start'>
          <Command filter={filter}>
            <CommandInput placeholder='Change status...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {Object.keys(statusOptions).map((id) => (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={onSelectedStatusChange}
                  >
                    <div className='flex items-center space-x-2'>
                      {statusIconMapper(
                        statusOptions[Number(id)].label,
                        'h-4 w-4'
                      )}
                      <span>{statusOptions[Number(id)].label}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
