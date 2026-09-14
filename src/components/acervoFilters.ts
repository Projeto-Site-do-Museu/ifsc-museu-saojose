export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim().replace(/\s+/g, ' ');
}

export function splitCategories(value?: string | null): string[] {
  return (value || '').split(',').map((category) => category.trim()).filter(Boolean);
}

interface FilterableItem {
  text: string;
  nome?: string | null;
  colecao?: string | null;
}

export function getCategories(items: FilterableItem[]): string[] {
  const unique = new Map<string, string>();
  for (const item of items) {
    for (const category of splitCategories(item.colecao)) {
      const key = normalizeSearch(category);
      if (!unique.has(key)) unique.set(key, category);
    }
  }
  return Array.from(unique.values()).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function filterAcervo<T extends FilterableItem>(items: T[], query: string, category: string): T[] {
  const term = normalizeSearch(query);
  const selected = normalizeSearch(category);
  return items.filter((item) => {
    const categories = splitCategories(item.colecao).map(normalizeSearch);
    const matchesCategory = !selected || categories.includes(selected);
    const matchesQuery = !term || [item.text, item.nome || '', ...categories]
      .some((value) => normalizeSearch(value).includes(term));
    return matchesCategory && matchesQuery;
  });
}
