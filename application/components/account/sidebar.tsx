import AccountModal from '@/components/account/accountModal';
import WorkspaceSwitcher from './workspaceSwitcher';
import WorkspaceProjects from './workspacesidebarProjects';

export default function Sidebar() {
  return (
    <>
      <div className='flex items-center gap-2 p-2'>
        <WorkspaceSwitcher />
      </div>

      <div className='flex flex-1 flex-col gap-2   rounded p-2'>
        <WorkspaceProjects />
      </div>

      <div className='flex flex-1 flex-col gap-2' />
      <div className='flex  gap-2 '>
        <AccountModal />
      </div>
    </>
  );
}
