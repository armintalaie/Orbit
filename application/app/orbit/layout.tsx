'use client';

import React from 'react';
import AuthContextProvider from '@/lib/context/AuthProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}

// function UserWorkspaces() {
//   const { fetcher, profile } = useContext(OrbitContext);
//   const { data, isLoading, error } = useSWR(
//     `/api/profiles/${profile.id}/workspaces`,
//     {
//       fetcher: () =>
//         fetcher(`/api/profiles/${profile.id}/workspaces`).then((res) =>
//           res.json()
//         ),
//     }
//   );

//   if (isLoading) {
//     return <Spinner />;
//   }

//   return (
//     <div className='flex flex-col border-gray-100 pb-5  '>
//       <h2 className='border-b p-3 text-xs font-semibold text-gray-700 dark:text-neutral-300'>
//         Workspaces
//       </h2>
//       <div className='flex flex-col items-center justify-between gap-4 '>
//         {data.map((workspace, index) => (
//           <Link
//             href={`/workspaces/${workspace.id}`}
//             key={index}
//             shallow={true}
//             className=' flex h-10 w-full items-center gap-4  border-b p-1 px-2  text-left text-sm text-gray-700 hover:bg-neutral-200 dark:text-neutral-400'
//           >
//             <div className='h-5 w-5 rounded-md bg-blue-100 p-1 dark:bg-neutral-800'>
//               <FolderClosed className='h-full w-full ' />
//             </div>
//             <span className='flex h-full items-center justify-between pl-2'>
//               {workspace.name}
//             </span>
//           </Link>
//         ))}
//         <Button
//           variant='ghost'
//           size='sm'
//           className='h-8 w-full text-left text-sm text-gray-700 dark:text-neutral-400'
//         >
//           <span className='flex h-full items-center justify-between pl-2'>
//             Create Workspace
//           </span>
//         </Button>
//       </div>
//     </div>
//   );
// }
