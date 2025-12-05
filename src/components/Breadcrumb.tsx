import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
    return (
        <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
            <Link
                href="/"
                className="text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                aria-label="Home"
            >
                <Home className="w-4 h-4" />
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={item.url}>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {isLast ? (
                            <span className="text-gray-900 font-medium" aria-current="page">
                                {item.name}
                            </span>
                        ) : (
                            <Link
                                href={item.url}
                                className="text-gray-600 hover:text-orange-500 transition-colors"
                            >
                                {item.name}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
