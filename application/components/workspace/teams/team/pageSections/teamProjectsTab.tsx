import { NewProject } from '@/components/workspace/projects/newProject';

export default function TeamProjectsTab({ team }: { team: any }) {
  return (
    <div className='flex flex-col gap-4 p-1 px-4'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-md medium'>Projects</h1>
        <NewProject button={true} />
      </div>
      <div className='flex flex-col gap-4'></div>
    </div>
  );
}
