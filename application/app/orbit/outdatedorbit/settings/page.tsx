// import { ProfileForm } from '@/components/settings/profile-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Settings() {
  return (
    <div className='dark  flex  w-full items-center justify-center gap-4 sm:flex-col md:flex-row'>
      sss
      <Tabs defaultValue='account' className='w-full'>
        <TabsList className='flex h-12 gap-4 rounded-none border-b border-gray-100 bg-gray-100 p-4 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'>
          <TabsTrigger className='' value='account'>
            Account
          </TabsTrigger>
          <TabsTrigger className='' value='notifications'>
            Notifications
          </TabsTrigger>
          <TabsTrigger className='' value='preferences'>
            Preferences
          </TabsTrigger>
          <TabsTrigger className='' value='integrations'>
            Integrations
          </TabsTrigger>
        </TabsList>
        <TabsContent value='account' className='p-4'>
          {/* <ProfileForm /> */}
        </TabsContent>
        <TabsContent value='password'>Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
