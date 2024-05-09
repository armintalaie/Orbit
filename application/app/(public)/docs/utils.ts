import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

export function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir) {
  const baseDirectory = path.join(process.cwd(), 'app', 'docs', dir)
  let mdxFiles = getMDXFiles(baseDirectory)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(baseDirectory, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug: cleanRoute(dir) + '/' + cleanRoute(slug),
      content,
    }
  })
}

function getAllPostsMetaDataFromDirectory(directory: string, recursive = false, withContent = false) {
  const currDir = directory.split('/').pop();
  const docs = {
    metadata: {
      title: currDir,
    },
    posts: [],
    directories: [],
  }
  const baseDirectory = path.join(process.cwd(), 'app', 'docs', directory)
  const files = fs.readdirSync(baseDirectory)
  const blogFiles = files.filter((file) => path.extname(file) === '.mdx')
  const posts = blogFiles.map((file) => {
    const filePath = path.join(baseDirectory, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { metadata } = parseFrontmatter(fileContent)
    return {
      metadata,
      slug: cleanRoute(directory) + '/' + cleanRoute(path.basename(file, path.extname(file))),
      content: withContent ? fileContent : undefined,
    }
  }).filter((post) => post.metadata.status !== 'hidden')

  docs.posts.push(...posts);

  if (recursive) {
    const directories = fs.readdirSync(baseDirectory).filter((file) => fs.statSync(path.join(baseDirectory, file)).isDirectory());    
    const subdirs = directories.map((subdirectory) => {
      const dir = directory.length > 0 ? `${directory}/${subdirectory}` : subdirectory;
      return getAllPostsMetaDataFromDirectory(dir, true)
      });
    docs.directories.push(...subdirs);

  }
  return docs
}

export function getAllBlogPostMetadata() {
  return getAllPostsMetaDataFromDirectory('', true)
}



export function getBlogPosts(recursive = false, dir, lvl = 1) {
  if (lvl >= 5) {
    return [];
  }
  const base = dir ? `docs/${dir}` : 'docs';
  const posts = getMDXData(dir? dir : '');
  if (recursive) {
    const directories = fs.readdirSync(path.join(process.cwd(), 'app', base)).filter((file) => fs.statSync(path.join(process.cwd(), 'app', base, file)).isDirectory());
    directories.forEach((directory) => {
      const fullDir = dir? `${dir}/${directory}` : directory;
      const subPosts = getBlogPosts(true, fullDir, lvl + 1);
      posts.push(...subPosts);
      posts.push(...getMDXData( fullDir));
    });
  }
  return posts
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}


function cleanRoute(route: string) {
  return route.replaceAll(' ', '-');
}