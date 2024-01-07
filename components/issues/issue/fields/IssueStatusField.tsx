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
import { OrbitContext } from '@/lib/context/OrbitContext';
import { IIssue, IStatus } from '@/lib/types/issue';
import { useContext, useState } from 'react';
import { toast } from 'sonner';
// import { useReward } from 'react-rewards';

type IssueStatusFieldProps = {
  statusId: number;
  issueId: number;
  contentOnly?: boolean;
  reload?: (issue?: IIssue) => void;
};

export default function IssueStatusField({
  statusId,
  issueId,
  contentOnly = false,
  reload,
}: IssueStatusFieldProps) {
  const { status: statusOptionsArr, fetcher } = useContext(OrbitContext);
  const statusOptions = groupById(statusOptionsArr);
  const [selectedStatusId, setSelectedStatusId] = useState<number>(statusId);
  const [open, setOpen] = useState(false);

  function groupById(array: IStatus[]): { [key: number]: IStatus } {
    return array.reduce((hash, obj) => ({ ...hash, [obj.id]: obj }), {});
  }

  async function updateStatus(id: number) {
    const res = await fetcher(`/api/issues/${issueId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // ...(reload ? { 'X-Full-Object': 'true' } : {}),
        'X-Full-Object': 'true',
      },
      body: JSON.stringify({
        statusid: id,
      }),
    });

    const data = (await res.json()) as IIssue;
    reload && reload(data);

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
      return 0;
    }
  }

  const onSelectedStatusChange = (value: string) => {
    const foundId = Object.keys(statusOptions).find((m) => m === value);
    if (!foundId) {
      return;
    }
    setSelectedStatusId(Number(foundId));
    updateStatus(Number(foundId));
  };

  const IssueStatusSection = () => {
    return (
      <Command filter={filter}>
        <CommandInput placeholder='Change status...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {Object.keys(statusOptions).map((id) => (
              <CommandItem
                key={id}
                value={id.toString()}
                onSelect={onSelectedStatusChange}
              >
                <div className='flex items-center space-x-2'>
                  {statusIconMapper(statusOptions[Number(id)].label, 'h-4 w-4')}
                  <span>{statusOptions[Number(id)].label}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  if (contentOnly) {
    return IssueStatusSection();
  }

  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='w-full justify-start p-0'>
            <div className='flex items-center space-x-2 text-2xs'>
              {statusIconMapper(
                statusOptions[selectedStatusId].label,
                'h-4 w-4'
              )}
              <span>{statusOptions[selectedStatusId].label}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='right' align='start'>
          {IssueStatusSection()}
        </PopoverContent>
      </Popover>
    </div>
  );
}
