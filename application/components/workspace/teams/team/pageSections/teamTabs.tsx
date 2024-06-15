import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoIcon, SettingsIcon, TargetIcon, Users2Icon } from 'lucide-react';
import TeamMembersTab from '@/components/workspace/teams/team/pageSections/teamMembersTab';
import TeamProjectsTab from '@/components/workspace/teams/team/pageSections/teamProjectsTab';
import TeamDetailsTab from '@/components/workspace/teams/team/pageSections/teamInfoTab';
import TeamSettingsTab from '@/components/workspace/teams/team/pageSections/teamSettingsTab';

export default function TeamTabs({ team }: { team: any; workspaceId: string }) {
  return (
    <Tabs defaultValue='members' className='h-scree  flex w-full flex-col overflow-y-scroll'>
      <TabsList className='sticky top-0 grid h-12 w-full grid-cols-4 rounded-none border-b bg-inherit p-0 shadow-none'>
        <TabsTrigger value='info'>
          <InfoIcon size={16} />
        </TabsTrigger>
        <TabsTrigger value='members'>
          <Users2Icon size={16} />
        </TabsTrigger>
        <TabsTrigger value='projects'>
          <TargetIcon size={16} />
        </TabsTrigger>
        <TabsTrigger value='settings'>
          <SettingsIcon size={16} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value='info'>
        <TeamDetailsTab team={team} />
      </TabsContent>
      <TabsContent value='members'>
        <TeamMembersTab team={team} />
      </TabsContent>
      <TabsContent value='projects'>
        <TeamProjectsTab team={team} />
      </TabsContent>
      <TabsContent value='settings' className={''}>
        <TeamSettingsTab team={team} />
      </TabsContent>
    </Tabs>
  );
}
