import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/docs/MDX';
import { formatDate, getBlogPosts } from 'app/(public)/docs/utils'
import { baseUrl } from '../sitemap'

export async function generateStaticParams() {
  let posts = getBlogPosts(true);

  return posts.map((post) => ({
    slug: post.slug.split('/')
  }))
}

export function generateMetadata({ params }) {
  let post = getBlogPosts(true).find((post) => post.slug === params.slug.join('/') )

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`

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
  }
}

export default function Blog({ params }) {
  let post = getBlogPosts(true).find((post) => post.slug === params.slug.join('/') )

  if (!post) {
    notFound()
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-y-scroll w-full   max-h-none ">
      <script
        type="application/ld+json"
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
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose prose-stone prose-invert max-w-4xl h-fit ">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}