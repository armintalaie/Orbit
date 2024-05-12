'use client';
import AccountModal from '@/components/account/accountModal';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { useContext, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';

export default function Sidebar() {
  const UserSession = useContext(UserSessionContext);
  const [userInfo, setUserInfo] = useState(null);
  const { changeWorkspace, currentWorkspace } = useContext(OrbitContext);

  async function getUserInfo() {
    const res = await fetch(`/api/v2/users/${UserSession.user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${UserSession.access_token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setUserInfo(data);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className='secondary-surface flex w-72 min-w-56 flex-col'>
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex items-center gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button className='flex w-full items-center gap-2 '>
                {currentWorkspace ? currentWorkspace.name : 'Select Workspace'}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='tertiary-surface  w-80 p-3 py-4'
              align='start'
            >
              <div className='flex w-full flex-col  gap-2 '>
                {userInfo &&
                  userInfo.workspaces.map((workspace) => (
                    <Button
                      key={workspace.id}
                      className='flex items-center gap-2  py-2'
                      onClick={() => changeWorkspace(workspace.workspaceId)}
                    >
                      <span>{workspace.name}</span>
                    </Button>
                  ))}

                <div className='flex w-full items-center border-t py-2'>
                  <Button
                    variant={'outline'}
                    className='flex w-full items-center gap-2 '
                  >
                    Create Workspace
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className='flex flex-1 flex-col gap-2' />

        <div className='flex  gap-2 '>
          <AccountModal />
        </div>
      </div>
    </div>
  );
}

// function CreateWorkspace() {
//     const [name, setName] = useState('');
//     const UserSession = useContext(UserSessionContext);
//     async function createWorkspace() {
//       const res = await fetch(`/api/v2/workspaces`, {
//         method: 'POST',
//         body: JSON.stringify({ workspaceId: name }),
//         headers: {
//           Authorization: `Bearer ${UserSession.access_token}`,
//         },
//       });
//       console.log(res);
//       const data = await res.json();
//       if (res.ok) {
//         toast('Workspace created');
//       } else {
//         toast(data.error);
//       }
//     }

//     return (
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button
//             variant='outline'
//             className='rounded-sm px-2 py-0 text-sm'
//             type='button'
//           >
//             Create workspace
//           </Button>
//         </DialogTrigger>
//         <DialogContent className='max-w-md'>
//           <DialogHeader>
//             <DialogTitle>New workspace</DialogTitle>
//             <DialogDescription>
//               Create a new workspace to start collaborating.
//             </DialogDescription>
//           </DialogHeader>
//           <div className='grid gap-4 py-4'>
//             <div className='flex items-center gap-4'>
//               <Label htmlFor='name' className='text-right'>
//                 Name
//               </Label>
//               <Input
//                 className='w-full'
//                 id='name'
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               type='submit'
//               onClick={(e) => {
//                 console.log(e);
//                 e.preventDefault();
//                 toast('Creating workspace');
//                 createWorkspace();
//               }}
//             >
//               Create
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     );
//   }
