export function IssueComments({ issueId, comments }: { issueId: number; comments: any[] }) {
  return (
    <div className='flex h-full w-full flex-col items-center  gap-2 border-t  py-2'>
      <div className='flex w-full flex-row items-center gap-2'>
        <h1 className='text-md  px-4  py-2 font-medium leading-tight '>Comments</h1>
      </div>
      <div className='flex w-full flex-col items-center justify-center gap-2 p-5'>
        {/* <div className='flex h-12 flex-col items-center justify-center gap-2 pb-4 bg-white shadow-sm w-full border border-gray-200 rounded-xl'>
       
      </div> */}
      </div>
    </div>
  );
}
