"use client";
import { OrbitContext } from "@/lib/context/OrbitGeneralContext";
import { gql, useQuery } from "@apollo/client";
import { useContext } from "react";

export default function ProjectPage({ params }: { params: { pid: string } }) {
  const {currentWorkspace} = useContext(OrbitContext);
  const {project, error, loading} = useProject({
    pid: params.pid,
    wid: currentWorkspace,
    fields: ['id', 'name', 'description', 'status', 'targetDate', 'startDate']
  });
  if (loading) return <div></div>;
  return (
    <div className='flex h-full w-full flex-col items-center justify-center p-2'>
      <h1>{project.name}</h1>
    </div>
  );
}

function useProject({pid, wid, fields}: {pid: string, wid: string, fields: any[]}) {
  const QUERY = gql`
    query GetProject($pid: String!, $wid: String!) {
      project(id: $pid, workspaceId: $wid) {
        ${fields.join('\n')}
      }
    }
  `;
  const {data, error, loading} = useQuery(QUERY, {
    variables: {
      pid,
      wid
    }
  });

  return {
    project: data?.project || {},
    error,
    loading
  }
}