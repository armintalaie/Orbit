'use client';

import { NewIssue } from '@/components/newIssue';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import IssueBoard from '@/components/projects/IssueMainBoard';
import PageWrapper from '@/components/layouts/pageWrapper';
import ProjectTitleField from '@/components/projects/project/projectTitleField';
import { UserSessionContext } from '@/lib/context/AuthProvider';

interface ProjectPageProps {
  id: number;
  title: string;
}

interface IProject {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  teamid?: number;
}

export default function ProjectPage({ id, title }: ProjectPageProps) {
  const userSession = useContext(UserSessionContext);
  const params = useParams();
  const projectId = id ? id : Number(params.projectId);
  const [project, setProject] = useState<IProject | null>(null);

  const issueQuery = {
    tid: params.teamid as string,
    pid: projectId,
    q: {
      projects: [projectId],
    },
    showProject: false,
  };

  async function fetchProject() {
    const res = await fetch(`/api/projects/${projectId}`, {
      headers: {
        Authorization: userSession?.access_token || '',
      },
    });
    const project = await res.json();
    setProject(project);
  }

  useEffect(() => {
    fetchProject();
  }, []);

  if (!project) {
    return <></>;
  }

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className='flex flex-row items-center gap-2'>
          <ProjectTitleField
            projectTitle={project.title}
            projectId={project.id}
            teamid={project.teamid}
          />
        </div>
        <div className='flex h-full items-center justify-center gap-2'>
          <NewIssue button={true} reload={fetchProject} projectid={projectId} />
        </div>
      </PageWrapper.Header>
      <PageWrapper.Content>
        <IssueBoard query={issueQuery} />
      </PageWrapper.Content>
    </PageWrapper>
  );
}
