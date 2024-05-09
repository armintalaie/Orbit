import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/docs/MDX';
import { formatDate, getBlogPosts } from 'app/(public)/docs/utils';
import { baseUrl } from '../sitemap';

export async function generateStaticParams() {
  let posts = getBlogPosts(true);

  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }));
}

export function generateMetadata({ params }) {
  let post = getBlogPosts(true).find(
    (post) => post.slug === params.slug.join('/')
  );

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    // openGraph: {
    //   title,
    //   description,
    //   type: 'article',
    //   publishedTime,
    //   url: `${baseUrl}/blog/${post.slug}`,
    //   images: [
    //     {
    //       url: ogImage,
    //     },
    //   ],
    // },
    // twitter: {
    //   card: 'summary_large_image',
    //   title,
    //   description,
    //   images: [ogImage],
    // },
  };
}

export default function Blog({ params }) {
  let post = getBlogPosts(true).find(
    (post) => post.slug === params.slug.join('/')
  );

  if (!post) {
    notFound();
  }

  return (
    <section className='mx-auto max-h-none w-full max-w-4xl overflow-y-scroll px-4 py-12 sm:px-6   lg:px-8 '>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
      />
      <h1 className='title text-2xl font-semibold tracking-tighter'>
        {post.metadata.title}
      </h1>
      <div className='mb-8 mt-2 flex items-center justify-between text-sm'>
        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className='prose prose-stone prose-invert h-fit max-w-4xl '>
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
