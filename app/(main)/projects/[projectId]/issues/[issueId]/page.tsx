'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWindowSize } from 'usehooks-ts';
import IssuePage from '@/components/issues/issue/IssuePage';

export default function Page() {
  const params = useParams();
  const [issue, setIssue] = useState<any>(null);
  const { issueId } = params;
  const { width } = useWindowSize();
  async function fetchIssue() {
    const res = await fetch(`/api/issues/${issueId}`);
    const resultIssue = await res.json();
    setIssue(resultIssue);
  }

  useEffect(() => {
    fetchIssue();
  }, []);

  return <IssuePage issueId={Number(issueId)} />;
}

function ProjectOptions({ projectId }: { projectId: string }) {
  const router = useRouter();

  async function deleteIssue() {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    router.push(`/projects/${projectId}`);
  }

  async function archiveProject() {
    const res = await fetch(`/api/projects/${projectId}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    router.push('/projects');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Issue Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant='ghost' onClick={() => deleteIssue()}>
            Delete Issue
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// function IssueInfoMobilePopver({
//   issue,
//   projectId,
//   pathname,
// }: {
//   issue: any;
//   projectId: string;
//   pathname: string;
// }) {
//   // open={open} onOpenChange={setOpen}
//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <Button
//           variant='outline'
//           className='m-0 flex h-8 items-center bg-neutral-700 p-2 text-xs text-neutral-50'
//         >
//           <InfoCircledIcon className='h-6 w-6 px-1 text-neutral-50' />
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent className='max-h-[90%] p-0 '>
//         <div className='flex h-full w-full overflow-scroll'>
//           <IssueInfo issue={issue} projectId={projectId} pathname={pathname} />
//         </div>
//         <DrawerFooter className='pt-2'>
//           <DrawerClose asChild>
//             <Button variant='outline'>Close</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }

// function CommentsMobilePopver({
//   issue,
//   projectId,
//   pathname,
// }: {
//   issue: any;
//   projectId: string;
//   pathname: string;
// }) {
//   // open={open} onOpenChange={setOpen}
//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <Button
//           variant='outline'
//           className='m-0 flex h-8 items-center bg-neutral-700 p-2 text-xs text-neutral-50'
//         >
//           <MessageCircleIcon className='h-6 w-6 pr-2 text-neutral-50' />
//           Comments
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent className='max-h-[90%] p-0 '>
//         <div className='flex h-full w-full overflow-scroll'>
//           <IssueInfo issue={issue} projectId={projectId} pathname={pathname} />
//         </div>
//         <DrawerFooter className='pt-2'>
//           <DrawerClose asChild>
//             <Button variant='outline'>Close</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }
