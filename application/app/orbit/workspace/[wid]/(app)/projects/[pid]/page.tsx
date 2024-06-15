'use client';
import Spinner from '@/components/general/skeletons/Spinner';
import PageWrapper from '@/components/general/layouts/pageWrapper';
import ProjectPageContent from '@/components/workspace/projects/project/projectPageContent';
import { gql, useQuery } from '@apollo/client';
import { NewIssue } from '@/components/workspace/issues/newIssue';
import { ProjectTitleInput } from '@/components/workspace/projects/project/standaloneFields/ProjectTitleField';
import PageWrapperComponent from '@/components/general/layouts/pageWrapperHeader';
import ProjectInfoContent from '@/components/workspace/projects/project/projectInfoContent';

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
      <PageWrapperComponent type={'header'}>
        <div className='flex flex-1 flex-row items-center gap-2'>
          {project && <ProjectTitleInput defaultValue={project.name} projectId={project.id} />}
        </div>
        <div className='flex h-full items-center justify-center gap-2'>
          <NewIssue button={true} defaultValues={{ projects: [params.pid] }} />
        </div>
      </PageWrapperComponent>
      <PageWrapperComponent type={'content'}>
        <ProjectPageContent params={{ wid: params.wid, pid: params.pid }} />
      </PageWrapperComponent>
      <PageWrapperComponent type={'sideContent'}>
        <ProjectInfoContent project={project} pid={params.pid} wid={params.wid} />
      </PageWrapperComponent>
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
