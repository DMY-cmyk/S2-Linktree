import { useMemo } from 'react';
import { useLinkStore } from '@/store/useLinkStore';
import type { Category, Link } from '@/types';

export interface FilteredResult {
  category: Category;
  links: Link[];
}

export function useFilteredLinks(searchQuery: string): FilteredResult[] {
  const categories = useLinkStore((s) => s.categories);
  const links = useLinkStore((s) => s.links);

  return useMemo(() => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const query = searchQuery.toLowerCase().trim();

    return sorted
      .map((category) => {
        const catLinks = links
          .filter((l) => l.categoryId === category.id)
          .sort((a, b) => a.order - b.order);

        if (!query) return { category, links: catLinks };

        const categoryNameMatches = category.name.toLowerCase().includes(query);
        const filteredLinks = categoryNameMatches
          ? catLinks
          : catLinks.filter(
              (l) =>
                l.title.toLowerCase().includes(query) ||
                l.url.toLowerCase().includes(query) ||
                (l.description?.toLowerCase().includes(query) ?? false)
            );

        return { category, links: filteredLinks };
      })
      .filter((result) => {
        if (!query) return true;
        return result.links.length > 0;
      });
  }, [categories, links, searchQuery]);
}
