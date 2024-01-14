import { redirect } from 'next/navigation';

export default async function Issues() {
  return redirect('/issues/me');
}
