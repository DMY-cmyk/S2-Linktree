'use client';

import { useState } from 'react';

interface LinkFaviconProps {
  url: string;
  size?: number;
}

export function LinkFavicon({ url, size = 16 }: LinkFaviconProps) {
  const [error, setError] = useState(false);

  let domain = '';
  try {
    domain = new URL(url).hostname;
  } catch {
    return <span className="text-sm leading-none">🌐</span>;
  }

  if (error) {
    return <span className="text-sm leading-none">🌐</span>;
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${size * 2}`}
      alt={`Favicon for ${domain}`}
      width={size}
      height={size}
      className="inline-block shrink-0 rounded-sm"
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
