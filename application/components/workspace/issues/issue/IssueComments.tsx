export function IssueComments({ issueId }: { issueId: number }) {
  return (
    <div className='flex h-full w-full flex-col items-center  gap-2 border-t border-gray-100 bg-white py-2 dark:border-neutral-900 dark:bg-neutral-900 dark:text-neutral-300'>
      <div className='flex w-full flex-row items-center gap-2'>
        <h1 className='text-md  px-4  py-2 font-medium leading-tight text-gray-700 dark:text-neutral-300'>Comments</h1>
      </div>
      <div className='flex w-full flex-col items-center justify-center gap-2 p-5'>
        {/* <div className='flex h-12 flex-col items-center justify-center gap-2 pb-4 bg-white shadow-sm w-full border border-gray-200 rounded-xl'>
       
      </div> */}
      </div>
    </div>
  );
}
