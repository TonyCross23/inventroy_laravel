import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface Props {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <nav className="flex items-center justify-end me-3 gap-1 mt-6 py-4">
            {links.map((link, index) => {
                // Previous Button
                if (index === 0) {
                    return (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`flex h-9 w-9 items-center justify-center rounded-md border border-input bg-card transition-colors hover:bg-accent ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    );
                }

                // Next Button
                if (index === links.length - 1) {
                    return (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`flex h-9 w-9 items-center justify-center rounded-md border border-input bg-card transition-colors hover:bg-accent ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    );
                }

                // Ellipsis (...)
                if (link.label === '...') {
                    return (
                        <span key={index} className="flex h-9 w-9 items-center justify-center text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                        </span>
                    );
                }

                // Page Numbers
                return (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold transition-all ${link.active
                                ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-primary dark:text-gray-900'
                                : 'border border-input bg-card hover:bg-accent hover:text-accent-foreground'
                            }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}