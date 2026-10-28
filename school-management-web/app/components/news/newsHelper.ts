import { getFullApiUrl } from '@/services/client';

export interface ParsedNewsContent {
  imageUrl: string | null;
  cleanText: string;
}

export function parseNewsImageAndText(text?: string | null): ParsedNewsContent {
  if (!text) return { imageUrl: null, cleanText: '' };

  let imageUrl: string | null = null;
  let cleanText = String(text);

  // 1. HTML Comment tag: <!--IMG:url-->
  const commentMatch = cleanText.match(/<!--\s*IMG:\s*([^\s>]+?)\s*-->/i);
  if (commentMatch) {
    imageUrl = commentMatch[1].trim().replace(/-+$/, '');
    cleanText = cleanText.replace(/<!--\s*IMG:\s*[\s\S]*?\s*-->/gi, '').trim();
  }

  // 2. Bracket tag: [IMG:url]
  if (!imageUrl) {
    const bracketMatch = cleanText.match(/\[IMG:\s*([^\]]+?)\s*\]/i);
    if (bracketMatch) {
      imageUrl = bracketMatch[1].trim().replace(/-+$/, '');
      cleanText = cleanText.replace(/\[IMG:\s*[\s\S]*?\s*\]/gi, '').trim();
    }
  }

  // 3. Markdown image: ![alt](url)
  if (!imageUrl) {
    const mdMatch = cleanText.match(/!\[.*?\]\((.*?)\)/);
    if (mdMatch) {
      imageUrl = mdMatch[1].trim().replace(/-+$/, '');
      cleanText = cleanText.replace(/!\[.*?\]\(.*?\)/g, '').trim();
    }
  }

  // Reject fake unsplash images
  if (imageUrl && imageUrl.includes('unsplash.com')) {
    imageUrl = null;
  }

  if (imageUrl) {
    imageUrl = getFullApiUrl(imageUrl);
  }

  return { imageUrl, cleanText };
}

export function extractPdfUrl(content?: string | null): string | null {
  if (!content) return null;

  // 1. First remove HTML comments (like <!--IMG:...-->) and any bracket tags
  const clean = String(content)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\[IMG:[^\]]*\]/gi, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .trim();

  // 2. Match standard PDF file or base64 data url or media API file path
  const match = clean.match(
    /(https?:\/\/[^\s"'<>]+\.pdf|data:application\/pdf;base64,[^\s"'<>]+|\/api\/backend\/media\/[^\s"'<>]+|\/api\/[^\s"'<>]+\/file|\/api\/[^\s"'<>]+)/i
  );

  if (!match) return null;

  // Strip trailing dashes, commas, colons or punctuation that might have leaked from tags
  const url = match[0].trim().replace(/[.,;:\->]+$/, '');
  if (!url) return null;

  return getFullApiUrl(url);
}

export function formatWithImageTag(text: string, imageUrl?: string | null): string {
  const clean = (text || '')
    .replace(/<!--\s*IMG:\s*[\s\S]*?\s*-->/gi, '')
    .replace(/\[IMG:\s*[\s\S]*?\s*\]/gi, '')
    .trim();

  if (!imageUrl || imageUrl.includes('unsplash.com')) {
    return clean;
  }

  let img = imageUrl.trim().replace(/-+$/, '');
  // Normalize by stripping local dev origin if present
  img = img.replace(/^https?:\/\/[^/]+/, '');
  return `<!--IMG:${img}-->${clean}`;
}
