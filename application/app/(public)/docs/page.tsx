import { getBlogPosts } from './utils';

export default function Page() {
  let posts = getBlogPosts(true, undefined, 1);

  return (
    <div className='prose prose-invert'>
      <h1>Orbit Docs</h1>
      <p>Welcome to Orbit Docs. Here you will find all the documentation you need to get started with Orbit.</p>
    </div>
  );
}
