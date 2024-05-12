'use client';

import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import IssueBoard from '@/components/projects/IssueMainBoard';
import PageWrapper from '@/components/layouts/pageWrapper';
import ProjectTitleField from '@/components/projects/project/projectTitleField';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { IIssue, IProject } from '@/lib/types/issue';
import { TextSelectIcon } from 'lucide-react';
import { setDocumentMeta } from '@/lib/util';
import { useOrbitSync } from '@/lib/hooks/useOrbitSync';
import ContentLoader from '@/components/general/ContentLoader';

interface ProjectPageProps {
  id: number;
  title: string;
}

export default function ProjectPage({ id, title }: ProjectPageProps) {
  const params = useParams();
  const projectId = id ? id : Number(params.projectId);
  const { projects } = useContext(OrbitContext);
  const initialProject = projects && projects.find((p) => p.id === projectId);

  const project: IProject | undefined | null = initialProject
    ? initialProject
    : null;
  const issueQuery = {
    tid: params.teamid as string,
    pid: projectId,
    q: {
      projects: [projectId],
    },
    showProject: false,
  };

  if (project === undefined) {
    return <></>;
  }

  if (project === null) {
    return <ProjectNotFound />;
  }

  setDocumentMeta(`Project ${project.title}`);

  const getRoute = () => {
    return `/api/issues?q=${encodeURIComponent(
      JSON.stringify(issueQuery.q || {})
    )}`;
  };

  const issueView = (
    <ContentLoader
      route={getRoute()}
      childProps={{ query: issueQuery }}
      childDataProp='issues'
      syncChannels={[`project:${project.id}`]}
    >
      <IssueBoard />
    </ContentLoader>
  );

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
        <div className='flex h-full items-center justify-center gap-2'></div>
      </PageWrapper.Header>
      <PageWrapper.Content>{issueView}</PageWrapper.Content>
    </PageWrapper>
  );
}

function ProjectNotFound() {
  return (
    <div className='flex w-full flex-grow flex-col items-center justify-center gap-4 space-x-4'>
      <TextSelectIcon className='h-24 w-24 text-gray-500' />
      <h1 className='text-4xl font-medium text-gray-500'>Project not found</h1>
    </div>
  );
}