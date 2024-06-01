'use client';
import Spinner from '@/components/general/Spinner';
import PageWrapper from '@/components/general/layouts/pageWrapper';
import ProjectInfoContent from '@/components/workspace/projects/project/projectInfoContent';
import ProjectPageContent from '@/components/workspace/projects/project/projectPageContent';
import { gql, useQuery } from '@apollo/client';
import { NewProject } from '@/components/workspace/projects/newProject';
import { NewIssue } from '@/components/workspace/issues/newIssue';

export default function ProjectPage({ params }: { params: { wid: string; pid: string } }) {
  const { project, loading } = useProject({
    pid: params.pid,
    wid: params.wid,
    fields: ['id', 'name', 'description', 'targetDate', 'startDate', { status: ['id', 'name'] }],
  });
  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    );
  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className='flex flex-row items-center gap-2'>{project && project.name}</div>
        <div className='flex h-full items-center justify-center gap-2'>
          <NewIssue button={true} defaultValues={{ projects: [params.pid] }} />
        </div>
      </PageWrapper.Header>
      <PageWrapper.Content>
        <ProjectPageContent params={{ wid: params.wid, pid: params.pid }} />
      </PageWrapper.Content>
      <PageWrapper.SideContent>
        <ProjectInfoContent project={project} pid={params.pid} wid={params.wid} />
      </PageWrapper.SideContent>
    </PageWrapper>
  );
}

function useProject({ pid, wid, fields }: { pid: string; wid: string; fields: any[] }) {
  function formatFields(fields: any[]): any {
    return fields
      .map((field) => {
        if (typeof field === 'string') {
          return field;
        } else if (typeof field === 'object') {
          const key = Object.keys(field)[0];
          return `${key} { ${formatFields(field[key])} }`;
        }
      })
      .join('\n');
  }

  const QUERY = gql`
    query GetProject($pid: String!, $wid: String!) {
      project(id: $pid, workspaceId: $wid) {
        ${formatFields(fields)}
      }
    }
  `;
  const { data, error, loading } = useQuery(QUERY, {
    variables: {
      pid,
      wid,
    },
  });

  return {
    project: data?.project as { [key: string]: any },
    error,
    loading,
  };
}
