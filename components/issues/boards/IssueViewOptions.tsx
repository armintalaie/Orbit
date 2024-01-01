import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ListIcon, KanbanSquareIcon } from 'lucide-react';

type ViewType = 'board' | 'table' | 'timeline';

export const IssueViewOptions = ({
  viewType,
  setViewType,
}: {
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
}) => {
  return (
    <ToggleGroup
      className='flex h-6 w-fit   flex-row  items-center justify-between gap-0 divide-x divide-gray-200 overflow-hidden  rounded-sm border border-gray-200  bg-gray-100 text-left text-xs  text-gray-500 shadow-sm '
      type='single'
      defaultValue='center'
      aria-label='Text alignment'
    >
      <ToggleGroupItem
        className={`flex w-8 items-center justify-center p-2 text-gray-700 data-[state=on]:bg-white data-[state=on]:text-gray-700
         ${viewType === 'table' ? 'bg-gray-100' : 'bg-inherit'}`}
        value='table'
        aria-label='Left aligned'
        onClick={() => setViewType('table')}
      >
        <ListIcon className='h-4 w-4' />
      </ToggleGroupItem>
      <ToggleGroupItem
        className={`flex w-8 items-center justify-center p-2 text-gray-700 data-[state=on]:bg-white data-[state=on]:text-gray-700
         ${viewType === 'board' ? 'bg-gray-100' : 'bg-inherit'}`}
        value='board'
        aria-label='Center aligned'
        onClick={() => setViewType('board')}
      >
        <KanbanSquareIcon className='h-4 w-4' />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
