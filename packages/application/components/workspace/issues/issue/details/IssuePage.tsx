'use client';

import { useCallback, useContext } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import TextEditor from '@/components/general/editor/textEditor';
import { IssueInfo } from './IssueInfo';
import { setDocumentMeta } from '@/lib/util';
import { gql, useQuery } from '@apollo/client';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import Spinner from '@/components/general/skeletons/Spinner';
import { IIssue } from '@/lib/types/issue';
import { IssueTitleInput } from '@/components/workspace/issues/issue/standaloneFields/IssueTitleField';

const ISSUE_QUERY = gql`
  query GetIssue($id: ID!, $workspaceId: String!) {
    issue(id: $id, workspaceId: $workspaceId) {
      id
      updatedAt
      title
      content
      status {
        id
        name
      }
      teamId
      targetDate
      assignees {
        id
        email
        profile {
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;

function useIssue({ id, workspaceId }: { id: number; workspaceId: string }) {
  const { data, error, loading } = useQuery(ISSUE_QUERY, {
    variables: {
      id,
      workspaceId,
    },
  });

  return {
    issue: data?.issue,
    error,
    loading,
  };
}

export default function IssuePage({ issueId }: { issueId: number }) {
  const { currentWorkspace } = useContext(OrbitContext);
  const { issue, error, loading } = useIssue({ id: issueId, workspaceId: currentWorkspace });

  const fullContent = useCallback(
    (issue: IIssue) => {
      return (
        <>
          <ResizablePanelGroup direction='horizontal'>
            <ResizablePanel minSize={30} collapsedSize={1} collapsible={true}>
              <div className=' flex h-full w-full flex-1 flex-col '>
                <div className='flex h-12 w-full items-center justify-between p-1  px-4  '>
                  <IssueTitleInput issueId={Number(issue.id)} defaultValue={issue.title} />
                  <div className='flex h-full items-center justify-center gap-2'></div>
                </div>
                <div className=' flex  w-full flex-1 flex-col overflow-y-scroll '>
                  <ResizablePanelGroup direction='vertical'>
                    <ResizablePanel>
                      <div className=' flex h-full w-full flex-grow flex-col overflow-x-hidden overflow-y-scroll'>
                        {issue && <TextEditor issue={issue} />}
                      </div>
                    </ResizablePanel>
                    {/*<ResizableHandle withHandle={true} />*/}
                    {/*<ResizablePanel collapsedSize={6} collapsible={true} defaultSize={6} minSize={6}>*/}
                    {/*  /!*<IssueComments issueId={issue.id} comments={issue.comments} />*!/*/}
                    {/*</ResizablePanel>*/}
                  </ResizablePanelGroup>
                </div>
              </div>
            </ResizablePanel>
            <ResizablePanel collapsedSize={1} collapsible={true} defaultSize={25} minSize={25}>
              <IssueInfo issueId={issue.id} refIssue={issue} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </>
      );
    },
    [issue]
  );

  if (loading) return <Spinner />;
  if (error) return <div>Error</div>;

  setDocumentMeta(`Issue ${issueId} - ${issue.title}`);

  return <div className='flex h-full w-full flex-col'>{fullContent(issue)}</div>;
}
