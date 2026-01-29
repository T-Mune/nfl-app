'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Live', href: '/' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'Standings', href: '/standings' },
  { name: 'Teams', href: '/teams' },
  { name: 'Players', href: '/players' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary text-primary-foreground shadow-lg">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">NFL</span>
              </div>
              <span className="font-bold text-xl tracking-tight">NFL Stats</span>
            </div>
          </Link>
        </div>
        <nav className="flex items-center space-x-1 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-2 rounded-md transition-colors',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
