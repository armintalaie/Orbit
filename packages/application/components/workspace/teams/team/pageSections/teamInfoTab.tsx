export default function TeamDetailsTab({ team }: { team: any }) {
  return (
    <div className='flex flex-col gap-4 p-1 px-4'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-md medium'>Details</h1>
      </div>
      <div className='flex flex-col gap-4'>
        <p>
          <span className='font-medium'>Description:</span> {team.description}
        </p>
      </div>
    </div>
  );
}
