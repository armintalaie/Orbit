import { StatusField } from '@/components/workspace/fields/statusField';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext } from 'react';

export default function ProjectStatusField({ field }) {
  const { workspace } = useContext(OrbitContext);
  const statuses = workspace?.config.projectStatus || [];
  return <StatusField field={field} statusOptions={statuses} placeholder='Select a status' />;
}
