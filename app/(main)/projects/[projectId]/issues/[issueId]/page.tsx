'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import IssuePage from '@/components/issues/issue/IssuePage';

export default function Page() {
  const params = useParams();
  const { issueId } = params;
  return <IssuePage issueId={Number(issueId)} />;
}
