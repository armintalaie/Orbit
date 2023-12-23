'use client';
import IssueBoard from '@/components/projects/IssueMainBoard';

export default function MyIssuePage() {
  return (
    <div className='flex h-full w-full flex-col'>
      <div className=' flex h-full w-full flex-1 flex-col '>
        <div className='flex h-12 w-full items-center justify-between p-4  px-4 '>
          <div className='flex flex-row items-center gap-2'>
            <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700'>
              My Issues
            </h1>
            {/* <ProjectOptions projectId={project.id} /> */}
          </div>
          <div className='flex h-full items-center justify-center gap-2'>
            {/* <NewIssue
              button={true}
              reload={fetchIssues}
              projectid={projectId}
            /> */}
          </div>
        </div>
        <IssueBoard />
      </div>
    </div>
  );
}
