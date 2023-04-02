import fs from 'fs';
import { join, basename } from 'path';
import matter from 'gray-matter';

export type BlogMetadata = {
  title: string;
  subtitle: string;
  cover: string;
  author: string;
  date: string;
  slug: string;
};

export type BlogDocument = BlogMetadata & {
  content: string;
};

const blogDirectory = join(process.cwd(), 'src/common/documents/blog');

export function getBlogSlugs() {
  const allFiles = fs.readdirSync(blogDirectory);
  return allFiles.filter((file) => basename(file).split('.').length === 2);
}

export function getBlogBySlug(slug: string, lang: string): BlogDocument {
  const realSlug = slug.replace(/\.md$/, '');
  const englishPath = join(blogDirectory, `${realSlug}.md`);
  const localePath = join(blogDirectory, `${realSlug}.${lang}.md`);
  const actualPath =
    lang !== 'en' && fs.existsSync(localePath) ? localePath : englishPath;
  const fileContents = fs.readFileSync(actualPath, 'utf8');
  const { data, content } = matter(fileContents);

  const document = { ...data, slug: realSlug, content } as BlogDocument;

  return document;
}

function getBlogMetadataBySlug(inputSlug: string): BlogMetadata {
  const { title, subtitle, cover, author, date, slug } = getBlogBySlug(
    inputSlug,
    'en'
  );

  return {
    title,
    subtitle,
    cover,
    author,
    date,
    slug,
  };
}

export function getAllBlogs(): BlogMetadata[] {
  const slugs = getBlogSlugs();
  const posts = slugs
    .map(getBlogMetadataBySlug)
    .map(({ title, subtitle, cover, author, date, slug }) => ({
      title,
      subtitle,
      cover,
      author,
      date,
      slug,
    }));

  return posts;
}
