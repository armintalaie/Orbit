import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { KanbanSquareIcon } from 'lucide-react';

type ViewType = 'board' | 'table';

export const IssueViewOptions = ({
  viewType,
  setViewType,
}: {
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
}) => {
  return (
    <ToggleGroup
      className='flex h-6 w-fit   flex-row  items-center justify-between gap-0 divide-x divide-gray-200 overflow-hidden  rounded-sm border   bg-gray-100 text-left text-xs   dark:bg-neutral-900 '
      type='single'
      defaultValue={viewType}
      aria-label='Text alignment'
    >
      <ToggleGroupItem
        className={`flex w-8 items-center justify-center p-2 text-gray-700 data-[state=on]:bg-white data-[state=on]:text-gray-700 dark:data-[state=on]:border-neutral-800 dark:data-[state=on]:bg-neutral-800 dark:data-[state=on]:text-neutral-300`}
        value='board'
        aria-label='Center aligned'
        onClick={() => setViewType('board')}
      >
        <KanbanSquareIcon className='h-4 w-4' />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
