import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { wid: string } }) {
  redirect(`/orbit/workspace/${params.wid}/projects`);
}
