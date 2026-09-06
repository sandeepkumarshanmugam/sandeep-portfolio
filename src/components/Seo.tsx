import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { profile } from '@/data/profile';

/**
 * Per-route document metadata.
 *
 * React 19 hoists `<title>`, `<meta>` and `<link>` rendered anywhere in the
 * tree into `<head>` — which is what a helmet library used to be for. But it
 * *appends*: it does not replace an equivalent tag already present in
 * index.html. Rendering a `<title>` and a description declaratively therefore
 * produced two of each on every route — invalid markup, and duplicate meta
 * descriptions, which is a genuine SEO defect.
 *
 * So the two tags that also exist statically in index.html are updated in
 * place, and everything else — Open Graph, Twitter, canonical, robots — is
 * rendered declaratively, since index.html declares none of those.
 *
 * Keeping the static pair in index.html is deliberate: it gives crawlers and
 * scrapers that do not execute JavaScript a correct title and description for
 * the site, rather than an untitled document.
 */
interface SeoProps {
  readonly title: string;
  readonly description: string;
  /** Omit to fall back to the site-wide social card. */
  readonly image?: string;
  /** `article` for case studies, `website` elsewhere. */
  readonly type?: 'website' | 'article';
  /** Keeps a page out of search results (e.g. the 404). */
  readonly noIndex?: boolean;
}

const SITE_NAME = `${profile.name} — Web Developer & AI/ML Enthusiast`;

/** Updates an existing `<meta name="...">`, creating it only if absent. */
function setMetaByName(name: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function Seo({
  title,
  description,
  image,
  type = 'website',
  noIndex = false,
}: SeoProps) {
  const { pathname } = useLocation();
  const canonical = new URL(pathname, profile.siteUrl).toString();
  const socialImage = new URL(image ?? '/media/og-image.jpg', profile.siteUrl).toString();

  // The home page owns the bare brand title; inner pages are suffixed.
  const documentTitle = pathname === '/' ? SITE_NAME : `${title} — ${profile.name}`;

  useEffect(() => {
    document.title = documentTitle;
    setMetaByName('description', description);
  }, [documentTitle, description]);

  return (
    <>
      <link rel="canonical" href={canonical} />
      {noIndex ? <meta name="robots" content="noindex, follow" /> : null}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={profile.name} />
      <meta property="og:title" content={documentTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content={`${profile.name} — Web Developer and AI/ML Enthusiast`}
      />

      {/* Twitter/X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={documentTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={socialImage} />
    </>
  );
}
