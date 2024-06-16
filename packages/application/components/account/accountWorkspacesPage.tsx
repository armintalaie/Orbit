import UserWorkspaces from '@/components/account/userWorkspaces';
import NewWorkspaceModal from '@/components/account/newWorkspaceModal';

export default function AccountWorkspacesPage() {
  return (
    <div className='flex h-full w-full flex-col items-center gap-5 overflow-hidden'>
      <div className=' flex w-full  items-center gap-5 rounded-md '>
        <p className=' flex-1 text-left text-sm'></p>
      </div>
      <div className='flex  w-full justify-end gap-5'>
        <NewWorkspaceModal />
      </div>
      <UserWorkspaces />
    </div>
  );
}
