import { Button } from '../ui/button';

export default function ModalSidebar({ menuOptions, setActiveMenu, activeMenu }) {
  return (
    <div className='secondary-surface flex w-56 min-w-56 flex-col'>
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-bold'>Settings</h1>
        </div>

        {Object.entries(menuOptions).map(([menuKey, menu]) => (
          <div className='flex flex-col gap-2 py-5'>
            <div className='flex items-center gap-2 border-b pb-4 text-sm text-neutral-600'>
              {menu.info.icon}
              {menu.info.label}
            </div>
            {Object.entries(menu.options).map(
              (
                [key, option] // Assuming items have an 'options' property to iterate over
              ) => (
                <Button
                  variant='ghost'
                  className='secondary-surface hover:tertiary-surface flex w-full justify-start gap-4 px-1'
                  key={option.id}
                  onClick={() => setActiveMenu([menuKey, key])}
                >
                  {option.icon}
                  {option.label}
                </Button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
