// app/search/page.tsx
import { Suspense } from 'react';
import SearchContent from '@/components/SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}