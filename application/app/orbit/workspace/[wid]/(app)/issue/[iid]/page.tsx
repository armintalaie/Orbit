import IssuePage from '@/components/workspace/issues/issue/details/IssuePage';

export default function Page({ params }: { params: { iid: string } }) {
  return <IssuePage issueId={Number(params.iid)} />;
}
