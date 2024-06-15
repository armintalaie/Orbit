import { SettingsContent, SettingsHeader } from '@/app/orbit/workspace/[wid]/settings/(settingsContent)/layout';
import WorkspaceAccountSettings from '@/components/workspace/settings/workspaceAccountSettings';

// TODO: fetch user data
export default function Page() {
  return (
    <>
      <SettingsHeader>Profile</SettingsHeader>
      <SettingsContent>
        <div className='flex h-full w-full flex-col items-center  gap-10 overflow-y-scroll '>
          <WorkspaceAccountSettings />
        </div>
      </SettingsContent>
    </>
  );
}
