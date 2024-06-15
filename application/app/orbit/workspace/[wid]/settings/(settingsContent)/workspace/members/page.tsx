import { SettingsContent, SettingsHeader } from '@/app/orbit/workspace/[wid]/settings/(settingsContent)/layout';
import WorkspaceMembers from '@/components/workspace/settings/workspaceMembersSettings';

export default function Page() {
  return (
    <>
      <SettingsHeader>Members</SettingsHeader>
      <SettingsContent>
        <div className='flex h-full w-full flex-col items-center  gap-10 overflow-y-scroll '>
          <WorkspaceMembers />
        </div>
      </SettingsContent>
    </>
  );
}
