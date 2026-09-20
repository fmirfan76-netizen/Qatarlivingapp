import React from 'react';

/**
 * Strips HTML tags to produce a clean plain-text preview snippet for cards.
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks whether a given string contains HTML formatting tags
 */
export function containsHtml(str: string): boolean {
  if (!str) return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Safely renders rich HTML description content or styled fallback plaintext
 */
export const SafeHtmlRenderer: React.FC<{
  content: string;
  className?: string;
}> = ({ content, className = '' }) => {
  if (!content) return null;

  const hasHtml = containsHtml(content);

  if (!hasHtml) {
    return (
      <div className={`whitespace-pre-line leading-relaxed ${className}`}>
        {content}
      </div>
    );
  }

  // Basic sanitization: strip script/iframe tags
  const sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');

  return (
    <div
      className={`prose prose-stone max-w-none prose-sm prose-p:my-2 prose-headings:my-2.5 prose-ul:my-2 prose-li:my-0.5 leading-relaxed break-words overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
