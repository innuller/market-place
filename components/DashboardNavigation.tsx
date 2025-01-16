// components/DashboardNavigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin/category', label: 'Category' },
  { href: '/admin/sub-category', label: 'Sub-category' },
  { href: '/admin/filters', label: 'Filters Management' },
];

export function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-center space-x-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'font-medium hover:text-green-400 transition-colors',
              pathname === link.href ? 'text-green-500' : ''
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}