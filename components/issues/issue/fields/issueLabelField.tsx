import { useContext, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CheckCircle2Icon, CircleIcon } from 'lucide-react';
import IssueLabel from '../../label';
import { ILabel } from '@/lib/types/issue';
import { toast } from 'sonner';
import { OrbitContext } from '@/lib/context/OrbitContext';

type IssueLabelFieldProps = {
  labels: ILabel[];
  issueId: number;
  contentOnly?: boolean;
};

export function IssueLabelField({
  labels,
  issueId,
  contentOnly = false,
}: IssueLabelFieldProps) {
  const [open, setOpen] = useState(false);
  const { labels: labelArray } = useContext(OrbitContext);
  const labelOptions: { [key: string]: ILabel } =
    groupLabelsAsIdObject(labelArray);
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>(
    labels.map((label) => label.id)
  );
  const { fetcher } = useContext(OrbitContext);

  function hasChanged() {
    return (
      selectedLabelIds.sort().join(',') !==
      labels
        .map((label) => label.id)
        .sort()
        .join(',')
    );
  }

  async function onOpenChange(open: boolean) {
    if (!open) {
      if (hasChanged()) {
        const operation = setTimeout(async () => {
          const res = await fetcher(`/api/issues/${issueId}/labels`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              labels: selectedLabelIds,
            }),
          });
          if (!res.ok) throw new Error(res.statusText);
        }, 4000);

        toast('Labels saved', {
          duration: 3000,
          action: {
            label: 'Undo',
            onClick: () => {
              clearTimeout(operation);
            },
          },
        });
      } else {
        toast('No changes to save', { duration: 1000 });
      }
    }
    setOpen(open);
  }

  function groupLabelsAsIdObject(labels: ILabel[]) {
    const labelsAsIdObject: any = {};
    labels.forEach((label) => {
      labelsAsIdObject[label.id] = label;
    });
    return labelsAsIdObject;
  }

  const filter = (value: string, search: string) => {
    if (!value || !labelOptions[value]) {
      return 0;
    }
    if (labelOptions[value].label.toLowerCase() === search.toLowerCase()) {
      return 1;
    }
    return labelOptions[value].label
      .toLowerCase()
      .indexOf(search.toLowerCase()) !== -1
      ? 0.5
      : 0;
  };

  const onLabelSelect = (value: string) => {
    setSelectedLabelIds((prev: number[]) => {
      const labelToAdd = labelOptions[value].id;
      if (prev.includes(labelToAdd)) {
        return prev.filter((id) => id !== labelToAdd);
      } else {
        return [...prev, labelToAdd];
      }
    });
  };

  if (!labelOptions || !labelArray) {
    return <></>;
  }

  const IssueLabelSection = (
    <Command filter={filter} className='overflow-y-scroll'>
      <CommandInput placeholder='Search Labels...' className='sticky top-0' />

      <CommandList className=''>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(labelOptions).map(([, label]) => (
          <CommandItem
            key={label.id}
            value={label.id.toString()}
            onSelect={onLabelSelect}
          >
            <div className='flex items-center gap-2'>
              {selectedLabelIds.some(
                (id) => id === label.id || id.toString() === label.id.toString()
              ) ? (
                <CheckCircle2Icon className='h-4 w-4' />
              ) : (
                <CircleIcon className='h-4 w-4' />
              )}
              <IssueLabel
                label={label.label}
                color={label.color}
                id={label.id}
              />
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );

  if (contentOnly) {
    return IssueLabelSection;
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <div className='m-0 flex flex-col  flex-wrap items-start gap-2  overflow-hidden  rounded-md  p-0 '>
        <PopoverTrigger asChild>
          <button className='flex flex-wrap items-center gap-1'>
            {selectedLabelIds.map((id) => (
              <div
                key={id}
                className='flex  w-fit items-center  justify-start gap-2 rounded-xl border bg-opacity-10  pr-2 text-2xs font-medium '
              >
                <IssueLabel
                  className=' hasChanged flex h-5 w-fit items-center justify-start gap-2 bg-opacity-10 text-2xs font-medium '
                  key={id}
                  label={labelOptions[id].label}
                  color={labelOptions[id].color}
                  id={labelOptions[id].id}
                  compact={true}
                />
                {labelOptions[id].label}
              </div>
            ))}
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent className='p-0' side='right' align='start'>
        {IssueLabelSection}
      </PopoverContent>
    </Popover>
  );
}
